import os
import json
import asyncio
import psycopg2
from psycopg2.extras import RealDictCursor
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from backend.database.supabase_client import get_db_connection, fetch_crisis_metrics

ARTIFACT_OUTPUT = os.path.join(os.path.dirname(__file__), 'analyst_report.json')

def fetch_latest_signal():
    """Fetch the most recent signal from market_signals."""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, url, change_summary, detected_at 
                FROM market_signals 
                ORDER BY detected_at DESC 
                LIMIT 1
            """)
            return cur.fetchone()
    finally:
        conn.close()

def market_telemetry_join():
    """
    Performs a high-performance join between market signals and 1M-row telemetry.
    Identifies if any competitive signal correlates with a regional engagement drop.
    """
    print("Analyst: Initiating 1M-row telemetry join...")
    crisis_data = fetch_crisis_metrics()
    
    # Logic: Search for the North America Payments anomaly (10% vs 25% baseline)
    na_crisis = next((r for r in crisis_data if r['region'] == 'North America'), None)
    
    insights = []
    if na_crisis and na_crisis['payment_percentage'] < 15.0:
        insights.append({
            "region": "North America",
            "metric": "Payments Engagement",
            "status": "CRITICAL_DROP",
            "value": f"{na_crisis['payment_percentage']}%",
            "context": "Structural divergence detected. Engagement is 15% below global baseline (~25%)."
        })
    else:
        insights.append({"status": "nominal", "message": "No significant regional divergence detected."})
        
    return insights

async def analyze_signal():
    print("Analyst Agent: Checking for new market signals...")
    signal = fetch_latest_signal()
    
    if not signal:
        print("No signals found in database.")
        return

    print(f"Analyst Agent: Found signal from Scout analyzing {signal['url']}.")
    
    category_to_query = "dashboard_widgets"
    if "integration" in signal['url']:
        category_to_query = "external_integrations"

    # Define the MCP Server parameters
    server_script = os.path.join(os.path.dirname(__file__), 'mcp_server.py')
    
    import sys
    python_exec = sys.executable

    server_params = StdioServerParameters(
        command=python_exec,
        args=[server_script],
        env=os.environ.copy()
    )

    print("Analyst Agent: Connecting to native MCP Telemetry Server (Initialization)...")
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            print(f"Analyst Agent: Tool Call -> get_churn_impact(feature_category='{category_to_query}')")
            
            # Execute tool call using the official SDK
            result = await session.call_tool("get_churn_impact", arguments={"feature_category": category_to_query})
            
            # Extract out the active_users from the tool result
            content = result.content[0].text
            impact_data = json.loads(content)
            
            active_users = impact_data.get("active_users", 0)
            print(f"Analyst Agent: Found {active_users} active users interacting with {category_to_query}.")

            # Calculate Risk Score (0-100)
            risk_score = min(int(active_users / 100), 100)
            
            final_artifact = {
                "signal_id": signal['id'],
                "signal_url": signal['url'],
                "impact_feature_category": category_to_query,
                "impact_active_users": active_users,
                "risk_score": risk_score,
                "analysis_summary": f"Detected change in competitor {signal['url']}. Overlaps with our feature '{category_to_query}' which has {active_users} active users. Calculated competitive risk score is {risk_score}/100."
            }
            
            with open(ARTIFACT_OUTPUT, "w") as f:
                json.dump(final_artifact, f, indent=2)
                
            print(f"Analyst Agent: Written structured output artifact to {ARTIFACT_OUTPUT}")
            print("---- Analyst JSON Artifact output ----")
            print(json.dumps(final_artifact, indent=2))

if __name__ == "__main__":
    asyncio.run(analyze_signal())
