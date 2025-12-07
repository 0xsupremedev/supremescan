import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Pool } from 'pg'
import { randomUUID } from 'crypto'

// Environment validation
function validateEnv() {
  const required = ['SUPREMESCAN_DB_URL']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    console.error('\n💡 Create a .env file based on .env.example')
    process.exit(1)
  }
}

validateEnv()

const app = express()
const port = process.env.PORT || 4000

// Database connection with error handling
let pool: Pool
try {
  pool = new Pool({
    connectionString: process.env.SUPREMESCAN_DB_URL,
  })
  // Test connection
  pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err)
  })
} catch (err) {
  console.error('❌ Failed to initialize database connection:', err)
  process.exit(1)
}

// CORS configuration (TODO: Implement whitelist from ALLOWED_ORIGINS env var)
app.use(cors())
app.use(bodyParser.json())

// Utility: map DB rows to API shapes
function mapScanRow(row: any) {
  return {
    id: row.scan_id,
    projectId: row.project_id,
    commit: row.commit,
    branch: row.branch,
    status: row.status,
    severitySummary: {
      critical: Number(row.severity_critical || 0),
      high: Number(row.severity_high || 0),
      medium: Number(row.severity_medium || 0),
      low: Number(row.severity_low || 0),
    },
    exploitabilityScore: row.exploitability_score ?? null,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  }
}

// Projects
app.post('/api/projects', async (req, res) => {
  try {
    const { name, repoUrl, provider = 'github', chain = 'ethereum', defaultBranch = 'main' } = req.body || {}
    if (!name || !repoUrl) {
      return res.status(400).json({ error: 'name and repoUrl are required' })
    }

    const projectId = `proj_${randomUUID().slice(0, 8)}`

    const { rows } = await pool.query(
      `INSERT INTO projects (project_id, name, repo_url, provider, chain, default_branch)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING project_id, name, repo_url, provider, chain, default_branch, created_at`,
      [projectId, name, repoUrl, provider, chain, defaultBranch]
    )

    res.status(201).json({ project: rows[0] })
  } catch (err) {
    console.error('Error creating project:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/projects', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT project_id AS "projectId", name, repo_url AS "repoUrl",
            provider, chain, default_branch AS "defaultBranch", created_at AS "createdAt"
     FROM projects
     ORDER BY created_at DESC`
  )
  res.json({ projects: rows })
})

app.get('/api/projects/:projectId', async (req, res) => {
  const { projectId } = req.params
  const projectResult = await pool.query(
    `SELECT project_id AS "projectId", name, repo_url AS "repoUrl",
            provider, chain, default_branch AS "defaultBranch", created_at AS "createdAt"
     FROM projects WHERE project_id = $1`,
    [projectId]
  )
  if (projectResult.rowCount === 0) {
    return res.status(404).json({ error: 'Project not found' })
  }

  const scansResult = await pool.query(
    `SELECT * FROM scans WHERE project_id = $1 ORDER BY created_at DESC LIMIT 10`,
    [projectId]
  )

  res.json({
    project: projectResult.rows[0],
    latestScans: scansResult.rows.map(mapScanRow),
  })
})

// Scans
app.post('/api/projects/:projectId/scans', async (req, res) => {
  const { projectId } = req.params
  const { branch } = req.body || {}

  const projectRes = await pool.query('SELECT default_branch FROM projects WHERE project_id = $1', [projectId])
  if (projectRes.rowCount === 0) {
    return res.status(404).json({ error: 'Project not found' })
  }

  const scanId = `scan_${randomUUID().slice(0, 8)}`
  const branchToUse = branch || projectRes.rows[0].default_branch || 'main'

  const insertRes = await pool.query(
    `INSERT INTO scans (scan_id, project_id, branch, status)
     VALUES ($1,$2,$3,'completed')
     RETURNING *`,
    [scanId, projectId, branchToUse]
  )

  // For now, create a single demo finding using the seeded reentrancy rule
  const ruleRes = await pool.query(
    `SELECT rule_id, remediation_summary FROM rules
     WHERE rule_id = 'SS-CRIT-001-reentrancy_no_guard'
     LIMIT 1`
  )
  if (ruleRes.rowCount > 0) {
    const findingId = `finding_${randomUUID().slice(0, 8)}`
    await pool.query(
      `INSERT INTO scan_findings (
         finding_id, scan_id, rule_id, severity, confidence,
         file_path, line_start, line_end, title, description, remediation
       ) VALUES (
         $1,$2,$3,'CRITICAL',0.95,
         $4,$5,$6,$7,$8,$9
       )`,
      [
        findingId,
        scanId,
        ruleRes.rows[0].rule_id,
        'contracts/Vault.sol',
        45,
        54,
        'Reentrancy without guard',
        'External call before state update without nonReentrant guard.',
        ruleRes.rows[0].remediation_summary || 'Protect with nonReentrant and move state updates before calls.',
      ]
    )

    await pool.query(
      `UPDATE scans
       SET severity_critical = 1,
           exploitability_score = 90,
           started_at = NOW(),
           completed_at = NOW()
       WHERE scan_id = $1`,
      [scanId]
    )
  }

  res.status(202).json({ scan: mapScanRow(insertRes.rows[0]) })
})

app.get('/api/scans/:scanId', async (req, res) => {
  const { scanId } = req.params
  const result = await pool.query('SELECT * FROM scans WHERE scan_id = $1', [scanId])
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Scan not found' })
  }
  res.json({ scan: mapScanRow(result.rows[0]) })
})

app.get('/api/scans/:scanId/findings', async (req, res) => {
  const { scanId } = req.params
  const { minSeverity, minConfidence } = req.query

  const severityOrder = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  const minSeverityIdx = minSeverity
    ? severityOrder.indexOf(String(minSeverity).toUpperCase())
    : -1
  const minConf = minConfidence ? Number(minConfidence) : 0.0

  const result = await pool.query(
    `SELECT * FROM scan_findings WHERE scan_id = $1 AND suppressed = FALSE`,
    [scanId]
  )

  const findings = result.rows
    .filter((row) => {
      const sevIdx = severityOrder.indexOf(String(row.severity).toUpperCase())
      return sevIdx >= (minSeverityIdx === -1 ? 0 : minSeverityIdx) && Number(row.confidence || 0) >= minConf
    })
    .map((row) => ({
      id: row.finding_id,
      scanId: row.scan_id,
      ruleId: row.rule_id,
      severity: row.severity,
      confidence: Number(row.confidence || 0),
      file: row.file_path,
      lineStart: row.line_start,
      lineEnd: row.line_end,
      title: row.title,
      shortDescription: row.description,
      remediationSummary: row.remediation,
      suppressed: row.suppressed,
      createdAt: row.created_at,
    }))

  res.json({ findings })
})

// Rules metadata
app.get('/api/rules', async (_req, res) => {
  const result = await pool.query(
    `SELECT rule_id, name, severity, class_id, category_id, subcategory_id
     FROM rules
     ORDER BY severity DESC, rule_id ASC`
  )
  res.json({ rules: result.rows })
})

app.get('/api/rules/:ruleId', async (req, res) => {
  const { ruleId } = req.params
  const ruleRes = await pool.query('SELECT * FROM rules WHERE rule_id = $1', [ruleId])
  if (ruleRes.rowCount === 0) {
    return res.status(404).json({ error: 'Rule not found' })
  }

  const patternsRes = await pool.query('SELECT pattern FROM rule_patterns WHERE rule_id = $1', [
    ruleRes.rows[0].rule_id, // Fixed: was using .id instead of .rule_id
  ])
  const examplesRes = await pool.query(
    'SELECT example_type, code FROM rule_examples WHERE rule_id = $1',
    [ruleRes.rows[0].rule_id] // Fixed: was using .id instead of .rule_id
  )

  res.json({
    rule: {
      ...ruleRes.rows[0],
      patterns: patternsRes.rows.map((r) => r.pattern),
      examples: examplesRes.rows,
    },
  })
})

app.listen(port, () => {
  console.log(`SupremeScan API listening on port ${port}`)
})


