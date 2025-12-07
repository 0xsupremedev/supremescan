-- 1. Top-level vulnerability classes
CREATE TABLE vuln_classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- 2. Categories under each class
CREATE TABLE vuln_categories (
  id SERIAL PRIMARY KEY,
  class_id INT NOT NULL REFERENCES vuln_classes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  UNIQUE (class_id, name)
);

-- 3. Subcategories
CREATE TABLE vuln_subcategories (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES vuln_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  UNIQUE (category_id, name)
);

-- 4. Chains (Ethereum, Solana, etc.)
CREATE TABLE chains (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,      -- 'evm', 'solana', etc.
  chain_id INT,                   -- optional EVM chain id
  description TEXT
);

-- 5. Token standards (ERC20, SPL, etc.)
CREATE TABLE token_standards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  chain_type VARCHAR(50) NOT NULL,
  description TEXT,
  UNIQUE (name, chain_type)
);

-- 6. Rules (detectors)
CREATE TABLE rules (
  id SERIAL PRIMARY KEY,
  rule_id VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  severity VARCHAR(16) NOT NULL,
  class_id INT REFERENCES vuln_classes(id),
  category_id INT REFERENCES vuln_categories(id),
  subcategory_id INT REFERENCES vuln_subcategories(id),
  detection_method VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  impact TEXT,
  remediation_summary TEXT,
  remediation_details TEXT,
  false_positive_notes TEXT,
  version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Rule ↔ chains (many-to-many)
CREATE TABLE rule_chain_support (
  id SERIAL PRIMARY KEY,
  rule_id INT NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  chain_id INT NOT NULL REFERENCES chains(id) ON DELETE CASCADE,
  UNIQUE (rule_id, chain_id)
);

-- 8. Rule ↔ token standards (many-to-many)
CREATE TABLE rule_token_support (
  id SERIAL PRIMARY KEY,
  rule_id INT NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  token_standard_id INT NOT NULL REFERENCES token_standards(id) ON DELETE CASCADE,
  UNIQUE (rule_id, token_standard_id)
);

-- 9. Rule patterns (for search / debugging)
CREATE TABLE rule_patterns (
  id SERIAL PRIMARY KEY,
  rule_id INT NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  pattern TEXT NOT NULL
);

-- 10. Rule examples (bad/good code)
CREATE TABLE rule_examples (
  id SERIAL PRIMARY KEY,
  rule_id INT NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  example_type VARCHAR(32) NOT NULL,
  code TEXT NOT NULL
);

-- 11. External references (SWC, docs, etc.)
CREATE TABLE rule_references (
  id SERIAL PRIMARY KEY,
  rule_id INT NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  title VARCHAR(255),
  url TEXT
);

-- 12. Version history per rule
CREATE TABLE rule_versions (
  id SERIAL PRIMARY KEY,
  rule_id INT NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  changes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


