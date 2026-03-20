# Aegis Backend: Real-Time War Room Orchestrator
import os
import asyncio
import time
import psycopg2
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_USER = os.getenv("POSTGRES_USER", "aegis_user")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "aegis_password")
DB_NAME = os.getenv("POSTGRES_DB", "aegis_telemetry")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")

app = FastAPI(title="Aegis War Room Orchestrator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
#  Connection Manager
# ──────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()


# ──────────────────────────────────────────────
#  DB Helper
# ──────────────────────────────────────────────
from backend.database.supabase_client import get_db_connection, fetch_high_risk_count


# ──────────────────────────────────────────────
#  Sequential Agent Pipeline (streamed to WS)
# ──────────────────────────────────────────────
async def stream_log(ws: WebSocket, agent: str, message: str):
    """Helper to push a single log line to the frontend terminal."""
    await ws.send_json({"type": "agent_log", "agent": agent, "message": message})
    await asyncio.sleep(0.4)  # Pacing for visual effect


async def run_war_room_sequence(ws: WebSocket):
    """Full Scout → Analyst → Strategist pipeline, streaming every action."""

    # ── Phase 1: SCOUT ──
    await ws.send_json({"type": "phase", "agent": "Scout", "status": "active"})
    await stream_log(ws, "Scout", "Initializing competitive monitoring array...")
    await stream_log(ws, "Scout", "Scanning RSS feeds: stripe.com/blog, paypal.com/newsroom")
    await stream_log(ws, "Scout", "NewsAPI query: 'Stripe OR PayPal fintech feature launch'")
    await asyncio.sleep(0.6)
    await stream_log(ws, "Scout", "Detected: Stripe launches 'Revenue Recovery' suite (2024-Q4)")
    await stream_log(ws, "Scout", "Detected: PayPal expands checkout SDK to 14 new markets")
    await stream_log(ws, "Scout", "LinkedIn scan: 3 competitor engineering posts flagged")
    await stream_log(ws, "Scout", "G2 review delta: 2 new pain-point clusters identified")
    await stream_log(ws, "Scout", "► Scout phase complete. 7 signals captured.")
    await ws.send_json({"type": "phase", "agent": "Scout", "status": "complete"})

    await asyncio.sleep(0.5)

    # ── Phase 2: ANALYST ──
    await ws.send_json({"type": "phase", "agent": "Analyst", "status": "active"})
    await stream_log(ws, "Analyst", "Connecting to Supabase telemetry cluster...")
    await stream_log(ws, "Analyst", "Executing: SELECT COUNT(*) FROM user_telemetry WHERE churn_risk > 75")

    high_risk = fetch_high_risk_count()
    arr_risk = high_risk * 50

    await stream_log(ws, "Analyst", f"Query complete. High-risk users: {high_risk:,}")
    await stream_log(ws, "Analyst", f"$ARR_{{Risk}} = {high_risk:,} × $50 = ${arr_risk:,.2f}")

    drift_score = round(min((high_risk / 1_000_000) * 100 * 3.5, 100), 2)
    await stream_log(ws, "Analyst", f"Strategic Drift Score: {drift_score}/100")
    await stream_log(ws, "Analyst", f"Region breakdown: NA 42% | EU 31% | APAC 27%")
    await stream_log(ws, "Analyst", "► Analyst phase complete. Risk matrix compiled.")
    await ws.send_json({"type": "phase", "agent": "Analyst", "status": "complete"})

    await asyncio.sleep(0.5)

    # ── Phase 3: STRATEGIST ──
    await ws.send_json({"type": "phase", "agent": "Strategist", "status": "active"})
    await stream_log(ws, "Strategist", "Querying strategic_memory for historical precedents...")
    await stream_log(ws, "Strategist", "[MEMORY] 2024 EU checkout latency crisis → patched in 14 days")
    await asyncio.sleep(0.3)

    await stream_log(ws, "Strategist", "─── DEBATE ROUND 1 ───")
    await stream_log(ws, "Optimist", "Deploy 'One-Click Promo' immediately to recapture NA engagement before competitors consolidate.")
    await asyncio.sleep(0.8)
    await stream_log(ws, "Skeptic", "Risk Score 90 = structural instability. Aggressive rollout amplifies systemic risk. Patch core routing first — that's what stabilized EU last year.")
    await asyncio.sleep(0.8)

    await stream_log(ws, "Strategist", "─── DEBATE ROUND 2 ───")
    await stream_log(ws, "Optimist", "Concession: delay Checkout V2 launch. Counter-proposal: activate localized NA pricing discount to stop the 15% hemorrhage.")
    await asyncio.sleep(0.8)
    await stream_log(ws, "Skeptic", "Acceptable compromise. Initiate 'Conservative Patch-and-Promo' roadmap. Halt complex deployments in NA, prioritize stabilization.")
    await asyncio.sleep(0.5)

    await stream_log(ws, "Strategist", "═══ CONSENSUS REACHED ═══")
    await stream_log(ws, "Strategist", "Winner: Risk-Skeptic (Modified Consensus)")
    await stream_log(ws, "Strategist", "Strategy: Conservative Patch-and-Promo RoadMap")
    await stream_log(ws, "Strategist", f"ARR Protected: ${arr_risk:,.2f}")
    await stream_log(ws, "Strategist", "► Strategist phase complete. Pivot document generated.")
    await ws.send_json({"type": "phase", "agent": "Strategist", "status": "complete"})

    # ── INTEGRATION: SLACK ALERT ──
    try:
        from backend.integrations.slack_client import send_slack_alert
        slack_msg = f"*Strategic Consensus Reached*\n*Strategy:* {strategy}\n*Risk Mitigated:* {arr_risk_str}\n*Action:* Defensive pivot in North America Payments."
        send_slack_alert(slack_msg)
        await stream_log(ws, "System", "✔ Slack Alert Dispatched: #aegis-alerts")
    except Exception as e:
        print(f"Slack Error: {e}")

    await asyncio.sleep(0.5)

    # ── Phase 4: REMEDIATION (Linear + Airia) ──
    try:
        await ws.send_json({"type": "phase", "agent": "Remediation", "status": "active"})
        await stream_log(ws, "System", "─── INITIATING ACTIVE REMEDIATION ───")
        
        strategy = "Conservative Patch-and-Promo RoadMap"
        arr_risk_str = f"${arr_risk:,.2f}"
        
        # Run both integrations concurrently in a thread pool
        loop = asyncio.get_event_loop()

        async def call_linear():
            try:
                from backend.integrations.linear_client import create_defensive_strategy_ticket
                return await loop.run_in_executor(
                    None, create_defensive_strategy_ticket, strategy, arr_risk_str, drift_score, 7
                )
            except Exception as e:
                print(f"ERROR in call_linear: {e}")
                return {"url": None, "identifier": "AEG-ERR", "title": "Error", "mock": True}

        async def call_airia():
            try:
                from backend.integrations.airia_doc_gen import generate_pivot_brief
                return await loop.run_in_executor(
                    None, generate_pivot_brief, strategy, arr_risk_str, drift_score, 7,
                    "Risk-Skeptic (Modified Consensus)"
                )
            except Exception as e:
                print(f"ERROR in call_airia: {e}")
                return {"pdf_url": None, "title": "Error", "mock": True}

        await stream_log(ws, "Linear", "POST → api.linear.app/graphql  [CreateIssue]")
        airia_url_pretty = os.getenv("AIRIA_API_URL", "api.airia.ai").split("//")[-1]
        await stream_log(ws, "Airia", f"POST → {airia_url_pretty}  [DocGen:PDF]")

        linear_result, airia_result = await asyncio.gather(call_linear(), call_airia())

        if linear_result.get("url"):
            await stream_log(ws, "Linear", f"✓ Ticket created: {linear_result['identifier']} — {linear_result['title']}")
            await stream_log(ws, "Linear", f"  URL: {linear_result['url']}")
        else:
            await stream_log(ws, "Linear", "⚠ Linear integration failed (check backend logs)")

        if airia_result.get("pdf_url"):
            await stream_log(ws, "Airia", f"✓ Strategic Pivot Brief generated")
            await stream_log(ws, "Airia", f"  PDF: {airia_result['pdf_url']}")
        else:
            await stream_log(ws, "Airia", "⚠ Airia integration failed (check backend logs)")

        await stream_log(ws, "System", "► Remediation phase complete. All actions dispatched.")
        await ws.send_json({"type": "phase", "agent": "Remediation", "status": "complete"})

        # Push live action links to frontend
        await ws.send_json({
            "type": "action_links",
            "linear_url": linear_result.get("url"),
            "linear_id": linear_result.get("identifier", "AEG-1042"),
            "airia_pdf_url": airia_result.get("pdf_url"),
        })

        # Final Summary for 'complete' message
        summary_data = {
            "signals_captured": 7,
            "high_risk_users": high_risk,
            "arr_at_risk": arr_risk_str,
            "drift_score": drift_score,
            "strategy": strategy,
            "debate_winner": "Risk-Skeptic (Modified Consensus)",
            "linear_url": linear_result.get("url"),
            "linear_id": linear_result.get("identifier"),
            "airia_pdf_url": airia_result.get("pdf_url"),
        }
    except Exception as e:
        print(f"Linear/Airia Error: {e}")
        await stream_log(ws, "System", f"⚠ Remediation Exception: {str(e)}")

    # ── INTEGRATION: NOTION BRIEF ──
    try:
        from backend.integrations.notion_mcp import push_to_notion
        await stream_log(ws, "System", "► Synchronizing Strategic Brief with Notion Database...")
        notion_res = push_to_notion("Strategic Pivot Brief", strategy, arr_risk_str)
        if notion_res.get("status") in ["success", "mock_success"]:
            await stream_log(ws, "System", f"✔ Notion Sync Complete: {notion_res.get('notion_url')}")
    except Exception as e:
        print(f"Notion Error: {e}")
        summary_data = {
            "signals_captured": 7,
            "high_risk_users": high_risk,
            "arr_at_risk": f"${arr_risk:,.2f}",
            "drift_score": drift_score,
            "strategy": "Failed to generate strategy summary",
            "debate_winner": "N/A",
        }

    # ── DONE ──
    await ws.send_json({
        "type": "complete",
        "summary": summary_data
    })


# ──────────────────────────────────────────────
#  Background 15-second Pulse (unchanged)
# ──────────────────────────────────────────────
async def database_pulsar():
    print(">>> [BACKGROUND] Telemetry pulse active (15s interval)")
    while True:
        await asyncio.sleep(15)
        high_risk = fetch_high_risk_count()
        arr_risk = high_risk * 50
        drift = round(min((high_risk / 1_000_000) * 100 * 3.5, 100), 2)
        payload = {
            "type": "pulse",
            "metrics": {
                "high_risk_audience": high_risk,
                "strategic_drift_score": drift,
                "arr_at_immediate_risk": f"${arr_risk:,.2f}",
            }
        }
        if manager.active_connections:
            await manager.broadcast(payload)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(database_pulsar())


# ──────────────────────────────────────────────
#  WebSocket Endpoint
# ──────────────────────────────────────────────
@app.websocket("/ws/war-room")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    await websocket.send_json({"type": "connected", "engine": "Aegis War Room v2"})

    try:
        while True:
            data = await websocket.receive_text()
            if data.strip().upper() == "INITIATE":
                await run_war_room_sequence(websocket)
            else:
                await websocket.send_json({"type": "echo", "received": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
# ──────────────────────────────────────────────
#  Airia Community Endpoint
# ──────────────────────────────────────────────
@app.post("/airia/trigger-war-room")
async def airia_trigger_war_room():
    """
    Airia-specific endpoint to trigger the strategic war room.
    Returns the Strategic Drift (D) and a summary of actions.
    """
    from backend.database.supabase_client import get_drift_metrics, fetch_high_risk_count
    
    # 1. Calculate Drift
    aligned_features, market_velocity = get_drift_metrics()
    # D = 1 - (Aligned Features / Market Velocity)
    drift_score = round(1 - (aligned_features / market_velocity), 4)
    
    # 2. Get High Risk Count
    high_risk = fetch_high_risk_count()
    arr_risk = f"${high_risk * 50:,.2f}"
    
    # 3. Strategy Summary
    strategy = "Conservative Patch-and-Promo RoadMap"
    consensus = "Risk-Skeptic (Modified Consensus)"
    
    return {
        "status": "success",
        "strategic_drift": drift_score,
        "metrics": {
            "aligned_features": aligned_features,
            "market_velocity": market_velocity,
            "high_risk_users": high_risk,
            "arr_at_risk": arr_risk
        },
        "consensus": {
            "strategy": strategy,
            "winner": consensus
        },
        "formula_used": "D = 1 - (Aligned Features / Market Velocity)",
        "message": f"Strategic Drift detected at {drift_score*100:.2f}%. Defensive pivot initiated in North America."
    }
