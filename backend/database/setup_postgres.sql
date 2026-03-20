-- Aegis Database Schema (1M-Row Telemetry Optimized)
-- Created for End-to-End Strategic Response Simulation

-- 1. Create user_telemetry table
CREATE TABLE IF NOT EXISTS user_telemetry (
    user_id UUID PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    churn_risk FLOAT NOT NULL
);

-- 2. Create market_signals table
CREATE TABLE IF NOT EXISTS market_signals (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    previous_hash VARCHAR(255),
    new_hash VARCHAR(255) NOT NULL,
    change_summary TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: user_telemetry is populated via seed_data.py for massive scale (1,000,000 rows).
