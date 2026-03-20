import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")

def send_slack_alert(message: str, channel: str = "#aegis-alerts"):
    """
    AEGIS SENTINEL: Real-Time Strategic Alerting
    Sends an alert message to Slack using a Webhook URL.
    """
    if not SLACK_WEBHOOK_URL or "your_slack_webhook" in SLACK_WEBHOOK_URL:
        # Fallback for hackathon demo
        print(f"SLACK_MOCK: {message}")
        return {"status": "mock_success"}

    payload = {
        "text": f"🚨 *AEGIS STRATEGIC ALERT*\n\n{message}",
        "channel": channel,
        "username": "Aegis Sentinel",
        "icon_emoji": ":shield:"
    }

    try:
        response = requests.post(SLACK_WEBHOOK_URL, json=payload, timeout=10)
        response.raise_for_status()
        return {"status": "success"}
    except Exception as e:
        print(f"Error sending Slack alert: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    res = send_slack_alert("Competitive drift detected: Regional Payments Crisis identified in North America (15% drop).")
    print(f"Slack Client: {res['status']}")
