import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { Pool } from 'pg'

interface RawRule {
  id: string
  name: string
  severity: string
  class: string
  category: string
  subcategory?: string
  detection: {
    method: string
    patterns: string[]
  }
  remediation: {
    summary: string
    details: string
  }
  examples?: {
    bad?: string
    good?: string
  }
  version?: string
  status?: string
}

const pool = new Pool({
  connectionString: process.env.SUPREMESCAN_DB_URL,
})

async function ensureClassHierarchy(raw: RawRule) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const classRows = await client.query(
      `INSERT INTO vuln_classes (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [raw.class]
    )
    const classId = classRows.rows[0].id

    const categoryRows = await client.query(
      `INSERT INTO vuln_categories (class_id, name)
       VALUES ($1, $2)
       ON CONFLICT (class_id, name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [classId, raw.category]
    )
    const categoryId = categoryRows.rows[0].id

    let subcategoryId: number | null = null
    if (raw.subcategory) {
      const subRows = await client.query(
        `INSERT INTO vuln_subcategories (category_id, name)
         VALUES ($1, $2)
         ON CONFLICT (category_id, name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [categoryId, raw.subcategory]
      )
      subcategoryId = subRows.rows[0].id
    }

    await client.query('COMMIT')
    return { classId, categoryId, subcategoryId }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function importRule(filePath: string) {
  const src = fs.readFileSync(filePath, 'utf8')
  const raw = yaml.load(src) as RawRule

  const { classId, categoryId, subcategoryId } = await ensureClassHierarchy(raw)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const rows = await client.query(
      `INSERT INTO rules (
         rule_id, name, severity,
         class_id, category_id, subcategory_id,
         detection_method,
         description,
         impact,
         remediation_summary,
         remediation_details,
         version,
         status
       ) VALUES (
         $1,$2,$3,
         $4,$5,$6,
         $7,
         $8,
         $9,
         $10,
         $11,
         COALESCE($12,'1.0.0'),
         COALESCE($13,'active')
       )
       ON CONFLICT (rule_id) DO UPDATE SET
         name = EXCLUDED.name,
         severity = EXCLUDED.severity,
         detection_method = EXCLUDED.detection_method,
         remediation_summary = EXCLUDED.remediation_summary,
         remediation_details = EXCLUDED.remediation_details,
         updated_at = NOW()
       RETURNING id`,
      [
        raw.id,
        raw.name,
        raw.severity,
        classId,
        categoryId,
        subcategoryId,
        raw.detection.method,
        raw.name,
        null,
        raw.remediation.summary,
        raw.remediation.details,
        raw.version,
        raw.status,
      ]
    )

    const ruleDbId = rows.rows[0].id

    await client.query('DELETE FROM rule_patterns WHERE rule_id = $1', [ruleDbId])
    for (const pattern of raw.detection.patterns || []) {
      await client.query('INSERT INTO rule_patterns (rule_id, pattern) VALUES ($1,$2)', [
        ruleDbId,
        pattern,
      ])
    }

    if (raw.examples?.bad) {
      await client.query(
        `INSERT INTO rule_examples (rule_id, example_type, code)
         VALUES ($1,'bad',$2)`,
        [ruleDbId, raw.examples.bad]
      )
    }
    if (raw.examples?.good) {
      await client.query(
        `INSERT INTO rule_examples (rule_id, example_type, code)
         VALUES ($1,'good',$2)`,
        [ruleDbId, raw.examples.good]
      )
    }

    await client.query('COMMIT')
    console.log(`Imported rule ${raw.id}`)
  } catch (e) {
    await client.query('ROLLBACK')
    console.error(`Failed to import ${filePath}:`, e)
  } finally {
    client.release()
  }
}

async function main() {
  const rulesDir = path.join(process.cwd(), 'rules')
  const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))

  for (const file of files) {
    await importRule(path.join(rulesDir, file))
  }

  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


