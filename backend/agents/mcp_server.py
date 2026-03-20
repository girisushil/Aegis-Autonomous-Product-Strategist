import os
import psycopg2
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server
mcp = FastMCP("aegis_telemetry_mcp")

from backend.database.supabase_client import get_db_connection

def init_mock_data():
    """Create the mock telemetry data table if it doesn't exist."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS user_telemetry (
                    id SERIAL PRIMARY KEY,
                    feature_category VARCHAR(100) NOT NULL,
                    active_users INT NOT NULL
                );
            """)
            cur.execute("SELECT COUNT(*) FROM user_telemetry;")
            if cur.fetchone()[0] == 0:
                data = [
                    ('authentication', 12500),
                    ('dashboard_widgets', 8300),
                    ('reporting_export', 4100),
                    ('external_integrations', 2750),
                    ('pricing_page', 950)
                ]
                cur.executemany(
                    "INSERT INTO user_telemetry (feature_category, active_users) VALUES (%s, %s)",
                    data
                )
        conn.commit()
    finally:
        conn.close()

init_mock_data()

@mcp.tool()
def get_churn_impact(feature_category: str) -> dict:
    """Get active users for a feature category to determine potential churn impact."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT active_users FROM user_telemetry WHERE feature_category = %s", (feature_category,))
            result = cur.fetchone()
            if result:
                return {"feature": feature_category, "active_users": result[0]}
            else:
                return {"feature": feature_category, "active_users": 0}
    finally:
        conn.close()

if __name__ == "__main__":
    # Start the FastMCP server over standard I/O (stdio)
    mcp.run()
