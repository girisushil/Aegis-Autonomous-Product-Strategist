import json
import hashlib
import time
import os
import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import RealDictCursor
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

# Paths and Config
WATCHLIST_PATH = os.path.join(os.path.dirname(__file__), 'watchlist.json')
from backend.database.supabase_client import get_db_connection

# Stealth Headers for avoiding bot detection
STEALTH_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
}

def init_db():
    """Ensure our tables exist."""
    print("Initializing Database...")
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS competitor_hashes (
                    url VARCHAR(255) PRIMARY KEY,
                    current_hash VARCHAR(255) NOT NULL,
                    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS market_signals (
                    id SERIAL PRIMARY KEY,
                    url VARCHAR(255) NOT NULL,
                    previous_hash VARCHAR(255),
                    new_hash VARCHAR(255) NOT NULL,
                    change_summary TEXT,
                    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
        conn.commit()
    finally:
        conn.close()

@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(3),
    retry=retry_if_exception_type((requests.RequestException, requests.ConnectionError))
)
def fetch_url(url: str) -> str:
    """Fetch URL with stealth headers and exponential backoff retry."""
    print(f"Fetching {url}...")
    with requests.Session() as session:
        response = session.get(url, headers=STEALTH_HEADERS, timeout=10)
        response.raise_for_status()
        return response.text

def extract_content(html: str) -> str:
    """Extract metadata and text from HTML for hashing."""
    soup = BeautifulSoup(html, 'html.parser')
    # Remove script and style elements
    for script in soup(["script", "style", "noscript", "iframe"]):
        script.extract()
    
    # Get text and metadata
    title = soup.title.string if soup.title else ""
    meta_tags = soup.find_all('meta')
    metadata = " | ".join([meta.get('content', '') for meta in meta_tags if meta.get('content')])
    
    text = soup.get_text(separator=' ')
    # Normalize spacing
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    cleaned_text = '\n'.join(chunk for chunk in chunks if chunk)
    
    return f"{title}\n{metadata}\n{cleaned_text}"

def compute_hash(content: str) -> str:
    """Compute SHA-256 hash of the content."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def process_competitor(conn, url: str):
    """Fetch URL, compare hash, and log a signal if there is a change."""
    try:
        html = fetch_url(url)
        content = extract_content(html)
        current_hash = compute_hash(content)
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT current_hash FROM competitor_hashes WHERE url = %s", (url,))
            result = cur.fetchone()
            
            if not result:
                # First time seeing this target
                print(f"[New Competitor]: Storing initial hash for {url}")
                cur.execute(
                    "INSERT INTO competitor_hashes (url, current_hash) VALUES (%s, %s)",
                    (url, current_hash)
                )
            else:
                stored_hash = result['current_hash']
                if stored_hash != current_hash:
                    print(f"[Change Detected]: {url} page content changed!")
                    # Log to market signals table
                    summary = f"Detected significant content or metadata change on {url}."
                    cur.execute(
                        "INSERT INTO market_signals (url, previous_hash, new_hash, change_summary) VALUES (%s, %s, %s, %s)",
                        (url, stored_hash, current_hash, summary)
                    )
                    # Update current hash
                    cur.execute(
                        "UPDATE competitor_hashes SET current_hash = %s, last_checked = CURRENT_TIMESTAMP WHERE url = %s",
                        (current_hash, url)
                    )
                else:
                    print(f"[No Change]: {url} is unchanged.")
                    cur.execute(
                        "UPDATE competitor_hashes SET last_checked = CURRENT_TIMESTAMP WHERE url = %s",
                        (url,)
                    )
        conn.commit()
    except Exception as e:
        print(f"Error processing {url}: {e}")

def main():
    # Prioritize COMPETITOR_WATCHLIST env var
    watchlist_env = os.getenv("COMPETITOR_WATCHLIST")
    if watchlist_env:
        print("Scout: Using COMPETITOR_WATCHLIST from environment.")
        # Try to parse as JSON first (to support rich objects), then fallback to comma-separated URLs
        try:
            competitors_raw = json.loads(watchlist_env)
            if isinstance(competitors_raw, list):
                competitors = competitors_raw
            else:
                competitors = [{"url": u.strip()} for u in watchlist_env.split(",")]
        except:
            competitors = [{"url": u.strip()} for u in watchlist_env.split(",")]
    elif os.path.exists(WATCHLIST_PATH):
        with open(WATCHLIST_PATH, 'r') as f:
            data = json.load(f)
            competitors = data.get('competitors', [])
    else:
        print(f"Watchlist not found at {WATCHLIST_PATH} and no COMPETITOR_WATCHLIST env var.")
        return
        
    init_db()
    
    conn = get_db_connection()
    try:
        for comp in competitors:
            process_competitor(conn, comp['url'])
            # Optional sleep to avoid rapid firing even after stealth headers
            time.sleep(2)
    finally:
        conn.close()

if __name__ == "__main__":
    main()
