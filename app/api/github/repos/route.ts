import { NextRequest, NextResponse } from 'next/server'
import { decryptToken } from '@/lib/github/oauth'
import { getUserRepositories } from '@/lib/github/oauth'

/**
 * GET /api/github/repos
 * Fetch authenticated user's GitHub repositories
 */
export async function GET(req: NextRequest) {
    try {
        // Get GitHub token from cookie
        const encryptedToken = req.cookies.get('github_token')?.value

        if (!encryptedToken) {
            return NextResponse.json(
                { error: 'GitHub not connected. Please connect your GitHub account first.' },
                { status: 401 }
            )
        }

        // Decrypt token
        const accessToken = decryptToken(encryptedToken)

        // Get query parameters
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('per_page') || '30')

        // Fetch repositories from GitHub
        const repositories = await getUserRepositories(accessToken, page, perPage)

        return NextResponse.json({ repositories })
    } catch (error: any) {
        console.error('Failed to fetch GitHub repositories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch repositories', details: error.message },
            { status: 500 }
        )
    }
}
