-- Add GitHub integration fields to users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  github_token_encrypted TEXT,
  github_user_id VARCHAR(64),
  github_username VARCHAR(255),
  github_avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add GitHub fields to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id VARCHAR(64) REFERENCES users(user_id) ON DELETE CASCADE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_repo_id BIGINT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_repo_full_name VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_last_commit_sha VARCHAR(64);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_last_commit_message TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_last_commit_date TIMESTAMP;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solidity_file_count INT DEFAULT 0;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_github_repo ON projects(github_repo_id);
