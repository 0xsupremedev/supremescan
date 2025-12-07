import { NextRequest, NextResponse } from 'next/server'
import { decryptToken } from '@/lib/github/oauth'
import { parseGitHubUrl } from '@/lib/github/api'
import { startRepositoryScan } from '@/lib/scanner/scanner-engine'

/**
 * POST /api/scans/start
 * Start scanning a linked repository
 */
export async function POST(req: NextRequest) {
    try {
        // Get GitHub token from cookie
        const encryptedToken = req.cookies.get('github_token')?.value

        if (!encryptedToken) {
            return NextResponse.json(
                { error: 'GitHub not connected' },
                { status: 401 }
            )
        }

        // Parse request body
        const body = await req.json()
        const { projectId, repoUrl } = body

        if (!repoUrl) {
            return NextResponse.json(
                { error: 'Repository URL is required' },
                { status: 400 }
            )
        }

        // Parse GitHub URL
        const parsed = parseGitHubUrl(repoUrl)
        if (!parsed) {
            return NextResponse.json(
                { error: 'Invalid GitHub repository URL' },
                { status: 400 }
            )
        }

        const { owner, repo } = parsed

        // Decrypt token
        const accessToken = decryptToken(encryptedToken)

        // Start scan
        const scanId = await startRepositoryScan(
            accessToken,
            owner,
            repo,
            projectId || 'unknown'
        )

        return NextResponse.json({
            message: 'Scan started successfully',
            scanId,
        }, { status: 201 })
    } catch (error: any) {
        console.error('Failed to start scan:', error)
        return NextResponse.json(
            { error: 'Failed to start scan', details: error.message },
            { status: 500 }
        )
    }
}
