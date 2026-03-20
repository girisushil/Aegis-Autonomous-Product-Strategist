"""
Aegis → Airia Doc Gen Integration
Generates a 'Strategic Pivot Brief' PDF via the Airia pipeline API.
Falls back to a mock URL when AIRIA_API_KEY is not configured.
"""
from dotenv import load_dotenv
import os
import json
import requests

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

AIRIA_API_KEY = os.getenv("AIRIA_API_KEY", "")
AIRIA_API_URL = os.getenv("AIRIA_API_URL", "https://api.airia.ai/v1/generate")
AIRIA_API_KEY = os.getenv("AIRIA_API_KEY", "")

MOCK_PDF_URL = "https://docs.aegis-platform.ai/briefs/strategic-pivot-2024-Q4.pdf"


def generate_pivot_brief(
    strategy: str,
    arr_risk: str,
    drift_score: float,
    signals_captured: int = 7,
    debate_winner: str = "Risk-Skeptic (Modified Consensus)",
) -> dict:
    """
    Call Airia Doc Gen to produce a Strategic Pivot Brief PDF.

    Returns:
        dict with 'pdf_url' and 'title' keys.
    """
    title = "Strategic Pivot Brief — Competitive Response Plan"
    prompt = (
        f"Generate a professional executive strategy brief document.\n\n"
        f"Title: {title}\n"
        f"ARR at Risk: {arr_risk}\n"
        f"Strategic Drift Score: {drift_score}/100\n"
        f"Signals Captured: {signals_captured}\n"
        f"Debate Winner: {debate_winner}\n"
        f"Recommended Strategy: {strategy}\n\n"
        f"Include sections: Executive Summary, Threat Assessment, "
        f"Financial Impact Analysis, Recommended Actions, Timeline, "
        f"and Success Metrics."
    )

    if not AIRIA_API_KEY:
        return {
            "pdf_url": MOCK_PDF_URL,
            "title": title,
            "mock": True,
        }

    headers = {
        "X-API-Key": AIRIA_API_KEY,
        "Content-Type": "application/json",
    }

    payload = {
        "prompt": prompt,
        "output_format": "pdf",
        "template": "executive_brief",
        "metadata": {
            "generated_by": "aegis-war-room",
            "arr_risk": arr_risk,
            "drift_score": drift_score,
        },
    }

    try:
        resp = requests.post(AIRIA_API_URL, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return {
            "pdf_url": data.get("document_url", MOCK_PDF_URL),
            "title": title,
            "mock": False,
        }
    except Exception as e:
        return {
            "pdf_url": MOCK_PDF_URL,
            "title": title,
            "mock": True,
            "error": str(e),
        }

if __name__ == "__main__":
    print(f"DEBUG: AIRIA_API_KEY starts with: {AIRIA_API_KEY[:10] if AIRIA_API_KEY else 'NONE'}")
    res = generate_pivot_brief("Consensus reached: Pivot to defensive engagement.", "$415k", 72.5)
    print(f"Airia Doc Status: {'Live' if not res.get('mock') else 'Mock'}")
    if res.get('mock') and res.get('error'):
        print(f"Airia Error: {res.get('error')}")
    print(f"PDF URL: {res.get('pdf_url')}")
