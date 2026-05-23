CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    description TEXT,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);