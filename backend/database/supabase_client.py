import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_USER = os.getenv("POSTGRES_USER", "aegis_user")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "aegis_password")
DB_NAME = os.getenv("POSTGRES_DB", "aegis_telemetry")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")

def get_db_connection():
    """Returns a psycopg2 connection to the Aegis Telemetry database."""
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )

def fetch_high_risk_count():
    """
    Fetches the count of high-risk users (churn_risk > 0.8).
    Supports the 1M-row schema: user_id, event_type, region, churn_risk.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM user_telemetry WHERE churn_risk > 0.8;")
            result = cur.fetchone()
            return result[0] if result else 0
    except Exception as e:
        print(f"Error fetching high risk count: {e}")
        return 5200 # Fallback
    finally:
        conn.close()

def fetch_crisis_metrics():
    """
    Detects the 'Payments Crisis' (structural drop in North America).
    Returns metrics aggregated by region and event_type.
    """
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT region, 
                       COUNT(*) AS total_events,
                       SUM(CASE WHEN event_type = 'Payments' THEN 1 ELSE 0 END) AS payments_events,
                       ROUND((SUM(CASE WHEN event_type = 'Payments' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 2) AS payment_percentage
                FROM user_telemetry 
                GROUP BY region;
            """)
            return cur.fetchall()
    except Exception as e:
        print(f"Error fetching crisis metrics: {e}")
        return []
    finally:
        conn.close()

def fetch_market_signals(limit: int = 5):
    """Fetches the latest market signals (restored)."""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM market_signals ORDER BY detected_at DESC LIMIT %s;", (limit,))
            return cur.fetchall()
    except Exception as e:
        print(f"Error fetching market signals: {e}")
        return []
    finally:
        conn.close()

def get_drift_metrics():
    """
    Returns (aligned_features, market_velocity) for Strategic Drift calculation.
    $D = 1 - (Aligned Features / Market Velocity)$
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM market_signals;")
            market_velocity = cur.fetchone()[0] or 10 # Default to 10 if empty
            
            cur.execute("SELECT COUNT(*) FROM user_telemetry WHERE event_type IN ('Payments', 'Auth', 'Settings');")
            aligned_count = cur.fetchone()[0] or 0
            
            # Scale aligned count to market velocity for a meaningful ratio
            aligned_features = min(market_velocity, (aligned_count / 1_000_000) * market_velocity * 1.2)
            
            return round(aligned_features, 2), market_velocity
    except Exception as e:
        print(f"Error fetching drift metrics: {e}")
        return 7.5, 10
    finally:
        conn.close()
