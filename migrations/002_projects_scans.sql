-- Projects table: represents a dApp / repository / contract set
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  repo_url TEXT,
  provider VARCHAR(64),              -- e.g. github, gitlab, bitbucket
  chain VARCHAR(64),                 -- e.g. ethereum, solana, polygon
  visibility VARCHAR(32) DEFAULT 'private',
  default_branch VARCHAR(128),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scans table: individual scan executions
CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  scan_id VARCHAR(64) UNIQUE NOT NULL,
  project_id VARCHAR(64) NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  commit VARCHAR(64),
  branch VARCHAR(128),
  status VARCHAR(32) NOT NULL,       -- queued | running | completed | failed
  severity_critical INT DEFAULT 0,
  severity_high INT DEFAULT 0,
  severity_medium INT DEFAULT 0,
  severity_low INT DEFAULT 0,
  exploitability_score INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Findings table: normalized vulnerabilities per scan
CREATE TABLE IF NOT EXISTS scan_findings (
  id SERIAL PRIMARY KEY,
  finding_id VARCHAR(64) UNIQUE NOT NULL,
  scan_id VARCHAR(64) NOT NULL REFERENCES scans(scan_id) ON DELETE CASCADE,
  rule_id VARCHAR(100) NOT NULL REFERENCES rules(rule_id) ON DELETE RESTRICT,
  severity VARCHAR(20) NOT NULL,
  confidence NUMERIC(3,2) DEFAULT 1.0,
  file_path TEXT,
  line_start INT,
  line_end INT,
  title TEXT,
  description TEXT,
  remediation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  suppressed BOOLEAN DEFAULT FALSE
);


