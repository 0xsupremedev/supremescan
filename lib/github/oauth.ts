import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

/**
 * GitHub OAuth configuration
 */
export const GITHUB_CONFIG = {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
    scopes: ['repo', 'user:email'],
}

/**
 * Generate GitHub OAuth authorization URL
 */
export function getGitHubAuthUrl(state?: string): string {
    const params = new URLSearchParams({
        client_id: GITHUB_CONFIG.clientId,
        scope: GITHUB_CONFIG.scopes.join(' '),
        redirect_uri: GITHUB_CONFIG.callbackUrl,
        ...(state && { state }),
    })

    return `https://github.com/login/oauth/authorize?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: GITHUB_CONFIG.clientId,
            client_secret: GITHUB_CONFIG.clientSecret,
            code,
            redirect_uri: GITHUB_CONFIG.callbackUrl,
        }),
    })

    if (!response.ok) {
        throw new Error(`Failed to exchange code: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
        throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`)
    }

    return data.access_token
}

/**
 * Encrypt GitHub access token before storage
 */
export function encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
}

/**
 * Decrypt GitHub access token
 */
export function decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}

/**
 * Get authenticated GitHub user info
 */
export async function getGitHubUser(accessToken: string) {
    const response = await fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch GitHub user: ${response.statusText}`)
    }

    return response.json()
}

/**
 * Get user's GitHub repositories
 */
export async function getUserRepositories(accessToken: string, page = 1, perPage = 30) {
    const response = await fetch(
        `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&sort=updated`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`)
    }

    return response.json()
}
