-- Supabase Initialization Script for Aegis (01_init_schema.sql)

-- 1. Enable Vector Extension for Semantic Search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Market Signals Table (from Scout agent)
CREATE TABLE IF NOT EXISTS public.market_signals (
    id SERIAL PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sentiment_score FLOAT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Telemetry Table (from internal Big Data / MCP metrics)
CREATE TABLE IF NOT EXISTS public.user_telemetry (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    region VARCHAR(50),
    churn_risk FLOAT DEFAULT 0.0,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Optimization for 1M+ rows on user_telemetry
-- Indexing on common query paths for Analyst agent
CREATE INDEX IF NOT EXISTS idx_user_telemetry_user_id ON public.user_telemetry (user_id);
CREATE INDEX IF NOT EXISTS idx_user_telemetry_event_type ON public.user_telemetry (event_type);
CREATE INDEX IF NOT EXISTS idx_user_telemetry_churn_risk ON public.user_telemetry (churn_risk);

-- 4. Strategic Memory Table (from Strategist agent historical debates)
CREATE TABLE IF NOT EXISTS public.strategic_memory (
    id SERIAL PRIMARY KEY,
    problem_statement TEXT NOT NULL,
    decision TEXT NOT NULL,
    outcome TEXT,
    embedding VECTOR(1536), -- Defaulting to OpenAI's 1536 dimension size
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add a HNSW index on the vector column to optimize semantic nearest-neighbor search
CREATE INDEX IF NOT EXISTS strategic_memory_embedding_idx 
ON public.strategic_memory USING hnsw (embedding vector_cosine_ops);
