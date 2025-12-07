import { query } from '../database/pool'
import { encryptToken, decryptToken } from '../github/oauth'

export interface User {
    id: number
    user_id: string
    email: string
    password_hash: string
    github_token_encrypted?: string
    github_user_id?: string
    github_username?: string
    github_avatar_url?: string
    created_at: Date
    updated_at: Date
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await query<User>(
        'SELECT * FROM users WHERE email = $1 LIMIT 1',
        [email]
    )
    return result.rows[0] || null
}

/**
 * Find user by user_id
 */
export async function findUserById(userId: string): Promise<User | null> {
    const result = await query<User>(
        'SELECT * FROM users WHERE user_id = $1 LIMIT 1',
        [userId]
    )
    return result.rows[0] || null
}

/**
 * Create a new user
 */
export async function createUser(
    userId: string,
    email: string,
    passwordHash: string
): Promise<User> {
    const result = await query<User>(
        `INSERT INTO users (user_id, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [userId, email, passwordHash]
    )
    return result.rows[0]
}

/**
 * Update user's GitHub token and info
 */
export async function updateUserGitHubToken(
    userId: string,
    accessToken: string,
    githubUserId: string,
    githubUsername: string,
    githubAvatarUrl?: string
): Promise<void> {
    const encryptedToken = encryptToken(accessToken)

    await query(
        `UPDATE users
     SET github_token_encrypted = $1,
         github_user_id = $2,
         github_username = $3,
         github_avatar_url = $4,
         updated_at = NOW()
     WHERE user_id = $5`,
        [encryptedToken, githubUserId, githubUsername, githubAvatarUrl, userId]
    )
}

/**
 * Get user's GitHub access token (decrypted)
 */
export async function getUserGitHubToken(userId: string): Promise<string | null> {
    const result = await query<{ github_token_encrypted: string }>(
        'SELECT github_token_encrypted FROM users WHERE user_id = $1',
        [userId]
    )

    const encrypted = result.rows[0]?.github_token_encrypted
    if (!encrypted) return null

    return decryptToken(encrypted)
}

/**
 * Check if user has GitHub connected
 */
export async function hasGitHubConnected(userId: string): Promise<boolean> {
    const result = await query<{ count: string }>(
        'SELECT COUNT(*) as count FROM users WHERE user_id = $1 AND github_token_encrypted IS NOT NULL',
        [userId]
    )
    return parseInt(result.rows[0]?.count || '0') > 0
}
