-- First run this.
CREATE DATABASE binance_data;

-- Then run this.
CREATE TABLE IF NOT EXISTS trades (
    tradeId BIGINT PRIMARY KEY,
    price VARCHAR(255),
    quantity VARCHAR(255),
    timestamp BIGINT
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON trades (timestamp);
