-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the database if it doesn't exist
-- This is handled by the container environment variables
