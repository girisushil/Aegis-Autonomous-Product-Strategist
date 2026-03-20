import os
import json
import psycopg2

DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_USER = os.getenv("POSTGRES_USER", "aegis_user")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "aegis_password")
DB_NAME = os.getenv("POSTGRES_DB", "aegis_telemetry")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")

UX_DELTA_FILE = os.path.join(os.path.dirname(__file__), 'ux_delta.json')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )

def extract_vision_delta():
    """Load the Multimodal Vision JSON output populated by the Gemini Agent."""
    print(">>> Loading Multimodal 'UX Delta' Intelligence from Vision Scout...")
    signals = []
    
    if os.path.exists(UX_DELTA_FILE):
        with open(UX_DELTA_FILE, 'r') as f:
            try:
                vision_data = json.load(f)
                
                # The payload may contain arbitrary delta nodes (new buttons, pricing, etc.)
                deltas = vision_data.get('ux_deltas', [])
                if not deltas:
                    # Fallback mapping if 'changes' was specifically used by the agent format output
                    deltas = vision_data.get('changes', [])
                    
                for change in deltas:
                    signals.append({
                        "source": "Multimodal Vision Subagent (Stripe)",
                        "content": f"UI Delta Detected: {change}",
                        "sentiment": 0.65  # Moderate competitive risk alert level
                    })
            except json.JSONDecodeError:
                print("Error: ux_delta.json payload from Vision model is technically malformed.")
    else:
        print(f"Warning: {UX_DELTA_FILE} not found. Ensure Browser Subagent executed properly.")
        
    return signals

def push_to_supabase(signals):
    """Insert the collated vision signals into the Postgres/Supabase database."""
    print(f">>> Committing {len(signals)} Multimodal Vision signals to Supabase...")
    if not signals:
        return
        
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            insert_query = """
                INSERT INTO market_signals (source, content, sentiment_score) 
                VALUES (%s, %s, %s)
            """
            for sig in signals:
                cur.execute(insert_query, (sig['source'], sig['content'], sig['sentiment']))
                print(f"    [Inserted] {sig['source']} | Content: {sig['content'][:50]}... | Sentiment: {sig['sentiment']}")
        conn.commit()
    except Exception as e:
        print(f"    [Error] Database insertion failed: {e}")
    finally:
        conn.close()

def main():
    print("--- [SCOUT: VISION INTELLIGENCE PIPELINE] ---")
    signals = extract_vision_delta()
    push_to_supabase(signals)
    print("--- PIPELINE COMPLETE ---")

if __name__ == "__main__":
    main()
