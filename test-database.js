const { Pool } = require('pg')
const crypto = require('crypto')

async function setupDatabase() {
    console.log('🔍 Testing database connection...\n')

    const connectionString = process.env.SUPREMESCAN_DB_URL ||
        'postgresql://supremescan_user:supremescan_password@localhost:5432/supremescan'

    const pool = new Pool({ connectionString })

    try {
        // Test connection
        const timeRes = await pool.query('SELECT NOW()')
        console.log('✅ Database connected successfully!')
        console.log(`   Time: ${timeRes.rows[0].now}\n`)

        // Check tables
        const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

        console.log('📋 Tables found:')
        tablesRes.rows.forEach(row => {
            console.log(`   - ${row.table_name}`)
        })
        console.log('')

        // Check user count
        const userCount = await pool.query('SELECT COUNT(*) FROM users')
        console.log(`👥 Users in database: ${userCount.rows[0].count}`)

        // Check project count
        const projectCount = await pool.query('SELECT COUNT(*) FROM projects')
        console.log(`📁 Projects in database: ${projectCount.rows[0].count}`)

        // Check scan count
        const scanCount = await pool.query('SELECT COUNT(*) FROM scans')
        console.log(`🔍 Scans in database: ${scanCount.rows[0].count}\n`)

        console.log('✅ Database setup verified!')
        console.log('\n📝 Don\'t forget to add to .env:')
        console.log(`   SUPREMESCAN_DB_URL=${connectionString}`)
        console.log(`   ENCRYPTION_KEY=${crypto.randomBytes(32).toString('hex')}\n`)

    } catch (error) {
        console.error('❌ Database connection failed!')
        console.error(`   Error: ${error.message}\n`)
        console.log('💡 Make sure:')
        console.log('   1. PostgreSQL is running')
        console.log('   2. Database "supremescan" exists')
        console.log('   3. User "supremescan_user" has access')
        console.log('   4. Migrations have been run\n')
        console.log('Run: setup-database.bat (on Windows)\n')
    } finally {
        await pool.end()
    }
}

setupDatabase()
