import { Pool, QueryResult } from 'pg'

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.SUPREMESCAN_DB_URL,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err)
})

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
    try {
        const client = await pool.connect()
        await client.query('SELECT NOW()')
        client.release()
        console.log('✅ Database connection successful')
        return true
    } catch (error) {
        console.error('❌ Database connection failed:', error)
        return false
    }
}

// Execute a query
export async function query<T = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> {
    const start = Date.now()
    try {
        const result = await pool.query<T>(text, params)
        const duration = Date.now() - start
        console.log('Executed query', { text, duration, rows: result.rowCount })
        return result
    } catch (error) {
        console.error('Database query error:', { text, error })
        throw error
    }
}

// Get a client from the pool for transactions
export async function getClient() {
    return await pool.query
}

// Transaction helper
export async function transaction<T>(
    callback: (client: any) => Promise<T>
): Promise<T> {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        const result = await callback(client)
        await client.query('COMMIT')
        return result
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

export default pool
