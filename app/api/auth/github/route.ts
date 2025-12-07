import { NextRequest, NextResponse } from 'next/server'
import { getGitHubAuthUrl } from '@/lib/github/oauth'
import { randomBytes } from 'crypto'

/**
 * GET /api/auth/github
 * Initiates GitHub OAuth flow
 */
export async function GET(req: NextRequest) {
    try {
        // Generate state for CSRF protection
        const state = randomBytes(32).toString('hex')

        // Store state in cookie for validation in callback
        const response = NextResponse.redirect(getGitHubAuthUrl(state))
        response.cookies.set('github_oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 10, // 10 minutes
        })

        return response
    } catch (error: any) {
        console.error('GitHub OAuth initiation error:', error)
        return NextResponse.json(
            { error: 'Failed to initiate GitHub OAuth' },
            { status: 500 }
        )
    }
}
