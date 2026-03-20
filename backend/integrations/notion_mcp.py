import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

NOTION_API_KEY = os.getenv("NOTION_API_KEY", "")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID", "")

def sync_notion_schema():
    """
    Ensures the Notion database has the required properties (ARR Risk, Phase).
    """
    if not NOTION_API_KEY or not NOTION_DATABASE_ID:
        return
    
    url = f"https://api.notion.com/v1/databases/{NOTION_DATABASE_ID}"
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    
    payload = {
        "properties": {
            "ARR Risk": {"rich_text": {}},
            "Phase": {
                "select": {
                    "options": [
                        {"name": "Remediation", "color": "red"},
                        {"name": "Monitoring", "color": "blue"},
                        {"name": "Resolved", "color": "green"}
                    ]
                }
            }
        }
    }
    
    try:
        resp = requests.patch(url, headers=headers, json=payload)
        if resp.status_code == 200:
            print("✅ Notion Database Schema Synchronized.")
        else:
            print(f"⚠️ Notion Schema Sync Warning: {resp.text}")
    except Exception as e:
        print(f"Error syncing Notion schema: {e}")

def push_to_notion(title: str, summary: str, arr_risk: str):
    """
    Aegis → Notion Integration
    Pushes a strategic brief to a Notion database.
    """
    if not NOTION_API_KEY or not NOTION_DATABASE_ID:
        print("Notion credentials not found. Mocking push...")
        return {"status": "mock_success", "notion_url": "https://notion.so/aegis-dashboard-mock"}

    # 1. Ensure schema exists (ARR Risk, Phase)
    sync_notion_schema()

    # 2. Fetch database to find the 'title' property name
    url_db = f"https://api.notion.com/v1/databases/{NOTION_DATABASE_ID}"
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    
    title_property_name = "Name" # fallback
    try:
        resp_db = requests.get(url_db, headers=headers)
        if resp_db.status_code == 200:
            props = resp_db.json().get("properties", {})
            for name, config in props.items():
                if config.get("type") == "title":
                    title_property_name = name
                    break
    except Exception as e:
        print(f"Warning: Could not fetch database properties for title detection: {e}")

    # 3. Push the page
    url = "https://api.notion.com/v1/pages"
    payload = {
        "parent": {"database_id": NOTION_DATABASE_ID},
        "properties": {
            title_property_name: {
                "title": [{"text": {"content": title}}]
            },
            "ARR Risk": {
                "rich_text": [{"text": {"content": arr_risk}}]
            },
            "Phase": {
                "select": {"name": "Remediation"}
            }
        },
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": summary}}]
                }
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            print(f"Notion API Error: {response.text}")
        response.raise_for_status()
        return {"status": "success", "notion_url": response.json().get("url")}
    except Exception as e:
        print(f"Error pushing to Notion: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    res = push_to_notion("Strategic Pivot Brief", "Consensus reached on Defensive Strategy.", "$415,000")
    print(f"Notion Integration: {res['status']}")
