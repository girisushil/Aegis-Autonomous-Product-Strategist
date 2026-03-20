# 🛡️ Aegis: Strategic Product Sentinel

**Protecting Product-Market Fit with Autonomous Intelligence.**

Aegis is an autonomous Product Strategist agent designed for the **Airia Community**. It specializes in detecting **Strategic Drift**—the divergence between internal product velocity and external market acceleration—and orchestrating rapid, data-driven defensive pivots.

## 📉 The Problem: Strategic Drift
In high-velocity markets, engineering teams often ship features that no longer align with shifting user needs or competitor breakthroughs. This "drift" results in:
- **Wasted ARR**: Building for a market state that no longer exists.
- **Structural Churn**: Users leaving because the product roadmap is desynced from reality.
- **Strategic Blindness**: Missing the signal of a competitor's market-redefining launch.

Aegis solves this by monitoring the **Strategic Drift Matrix**:

$$D = 1 - \frac{\text{Aligned Features}}{\text{Market Velocity}}$$

---

## 🚀 Key Features

### 1. Autonomous Multi-Agent Pipeline
Aegis operates via a sequential, stateful pipeline that handles the full intelligence lifecycle:
- **Scout**: Continuous monitoring of RSS, NewsAPI, LinkedIn, and G2 competitive signals.
- **Analyst**: Real-time telemetry analysis using a **Cloud-Hosted Supabase (PostgreSQL)** instance. It queries over **3 Million+ rows** of user events to calculate **ARR at Risk** with sub-second latency.
- **Strategist**: A **Simulation Lab** where AI personas (Optimist vs. Skeptic) debate historical precedents and determine the optimal pivot strategy.
- **Remediation**: Automated execution of the chosen strategy across your technical stack.

### 2. The War Room (Real-time Dashboard)
A live, WebSocket-powered interface that streams Aegis's "internal thought process," giving stakeholders visibility into competitive scans, risk calculations, and strategic debates as they happen.

### 3. Omni-channel Remediation
Once a consensus is reached, Aegis autonomously:
- 📢 Alerts the team via **Slack**.
- 📝 Documents the pivot strategy in **Notion**.
- 🎟️ Creates engineering tickets in **Linear**.
- 📄 Generates an executive **Strategic Pivot Brief PDF** via the **Airia DocGen** pipeline.

---

## 🛠️ Technical Stack

- **AI Orchestration**: [Airia](https://airia.ai) Community Platform & [MCP (Model Context Protocol)](https://modelcontextprotocol.io).
- **Core Reasoning**: Google Gemini (via `google-genai`).
- **Backend**: FastAPI with asynchronous WebSocket streaming.
- **Frontend**: React + TypeScript + Vite, featuring a terminal-style real-time log.
- **Data & Auth**: **Cloud-Hosted Supabase** (PostgreSQL) managing **3M+ Telemetry Rows**, Redis.
- **Integrations**: Slack SDK, Notion API, Linear GraphQL.
- **Infrastructure**: Docker & Ngrok for secure local-to-cloud exposure.

---

## 📁 Project Structure

```bash
├── Aegis/
│   ├── backend/                # FastAPI Orchestrator & Integrations
│   │   ├── agents/             # Scout, Analyst, Strategist logic
│   │   ├── integrations/       # Slack, Notion, Linear, Airia DocGen
│   │   └── main.py             # WebSocket & REST API
│   ├── frontend/               # React + TypeScript Dashboard
│   ├── airia_system_prompt.md  # AI Persona & Logic Governance
│   ├── mcp-manifest.json       # MCP Tooling Schema
│   └── docker-compose.yml      # Local Infrastructure
```

## ⚡ Quick Start

### 1. Clone & Setup
```bash
git clone girisushil/Aegis-Autonomous-Product-Strategist
cd Aegis
cp .env.template .env
```

### 2. Install Dependencies
```bash
# Backend
pip install -r backend/requirements.txt
# Frontend
cd frontend && npm install
```

### 3. Launch the War Room
```bash
# Terminal 1: Backend
uvicorn backend.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

*Built with ❤️ for the Airia Hackathon.*
