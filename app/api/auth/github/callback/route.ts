import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, getGitHubUser, encryptToken } from '@/lib/github/oauth'
import { verifyToken } from '@/lib/auth/jwt'
import { getAuthToken } from '@/lib/api/route-utils'

/**
 * GET /api/auth/github/callback
 * Handles GitHub OAuth callback
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        // Check for OAuth errors
        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=${encodeURIComponent(error)}`
            )
        }

        // Validate required parameters
        if (!code || !state) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=missing_code`
            )
        }

        // Verify CSRF state
        const storedState = req.cookies.get('github_oauth_state')?.value
        if (!storedState || storedState !== state) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=invalid_state`
            )
        }

        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code)

        // Get GitHub user info
        const githubUser = await getGitHubUser(accessToken)

        // Encrypt token before storage
        const encryptedToken = encryptToken(accessToken)

        // TODO: Store encrypted token in database associated with user
        // For now, we'll store in a secure cookie (temporary solution)
        const response = NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?github_connected=true`
        )

        // Store GitHub token in secure cookie
        response.cookies.set('github_token', encryptedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        })

        // Store GitHub user info
        response.cookies.set('github_user', JSON.stringify({
            id: githubUser.id,
            login: githubUser.login,
            name: githubUser.name,
            avatar_url: githubUser.avatar_url,
        }), {
            httpOnly: false, // Allow client access for display
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        })

        // Clear state cookie
        response.cookies.delete('github_oauth_state')

        return response
    } catch (error: any) {
        console.error('GitHub OAuth callback error:', error)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=auth_failed`
        )
    }
}
