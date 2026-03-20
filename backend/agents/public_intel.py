import os
import json
import feedparser
import psycopg2
from datetime import datetime

DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_USER = os.getenv("POSTGRES_USER", "aegis_user")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "aegis_password")
DB_NAME = os.getenv("POSTGRES_DB", "aegis_telemetry")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")

G2_INTEL_FILE = os.path.join(os.path.dirname(__file__), 'g2_intel.json')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )

def extract_news_api_features():
    """Mock NewsAPI query extracting PR releases."""
    print(">>> Fetching NewsAPI for Competitor PR...")
    # Simulated response from NewsAPI
    return [
        {
            "source": "NewsAPI - Stripe Wire",
            "content": "Stripe announces new simplified one-click checkout features reducing cart abandonment by 20%.",
            "sentiment": 0.85
        },
        {
            "source": "NewsAPI - PayPal Wire",
            "content": "PayPal introduces enhanced AI-driven fraud detection suite for enterprise merchants.",
            "sentiment": 0.75
        }
    ]

def extract_rss_blogs():
    """Fetch competitor engineering/product blogs via RSS."""
    print(">>> Parsing Competitor RSS Feeds...")
    signals = []
    
    # Example: Mocking reading a Stripe RSS feed
    # In reality, feedparser.parse('https://stripe.com/blog/feed.xml')
    # For this hackathon script, we simulate the feed return array.
    
    mock_rss_entries = [
        {"title": "Introducing global payouts expanding to 50 new countries", "summary": "We are excited to launch the new global payout expansion feature..."},
        {"title": "API Changelog Q3", "summary": "Minor fixes and billing logic updates..."}
    ]
    
    for entry in mock_rss_entries:
        if "new" in entry['title'].lower() or "launch" in entry['summary'].lower() or "introducing" in entry['title'].lower():
            signals.append({
                "source": "RSS - Stripe Blog",
                "content": f"New Feature Detected: {entry['title']} - {entry['summary']}",
                "sentiment": 0.8  # Positive feature release
            })
            
    return signals

def embed_g2_pain_points():
    """Read the Subagent's mapped output from G2."""
    print(">>> Loading G2 Intelligence from Browser Subagent...")
    signals = []
    
    if os.path.exists(G2_INTEL_FILE):
        with open(G2_INTEL_FILE, 'r') as f:
            try:
                g2_data = json.load(f)
                for pain_point in g2_data.get('pain_points', []):
                    signals.append({
                        "source": "G2 Reviews Subagent",
                        "content": f"Pain Point: {pain_point}",
                        "sentiment": 0.15  # Negative sentiment for distinct pain points
                    })
            except json.JSONDecodeError:
                print("Error: g2_intel.json is technically malformed.")
    else:
        print(f"Warning: {G2_INTEL_FILE} not found. Ensure Browser Subagent executed properly.")
        # We will gracefully continue even if missing, to ensure robustness.
        
    return signals

def push_to_supabase(signals):
    """Insert the collated market signals into the Supabase database."""
    print(f">>> Committing {len(signals)} new Public Intel signals to Supabase...")
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            insert_query = """
                INSERT INTO market_signals (source, content, sentiment_score) 
                VALUES (%s, %s, %s)
            """
            for sig in signals:
                cur.execute(insert_query, (sig['source'], sig['content'], sig['sentiment']))
                print(f"    [Inserted] {sig['source']} | Sentiment: {sig['sentiment']}")
        conn.commit()
    except Exception as e:
        print(f"    [Error] Database insertion failed: {e}")
    finally:
        conn.close()

def main():
    print("--- [SCOUT: PUBLIC INTEL PIPELINE] ---")
    all_signals = []
    
    # 1. G2 Reviews (Unstructured Web Scraping handled by Subagent)
    all_signals.extend(embed_g2_pain_points())
    
    # 2. Competitor RSS Blogs
    all_signals.extend(extract_rss_blogs())
    
    # 3. PR Wires (NewsAPI)
    all_signals.extend(extract_news_api_features())
    
    # Persist
    push_to_supabase(all_signals)
    
    print("--- PIPELINE COMPLETE ---")

if __name__ == "__main__":
    main()
