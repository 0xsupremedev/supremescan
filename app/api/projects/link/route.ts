import { NextRequest, NextResponse } from 'next/server'
import { decryptToken } from '@/lib/github/oauth'
import {
    getRepositoryDetails,
    getLatestCommit,
    getSolidityFiles,
    parseGitHubUrl,
} from '@/lib/github/api'
import { randomUUID } from 'crypto'

/**
 * POST /api/projects/link
 * Link a GitHub repository to create a project
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
        const { repoUrl, provider = 'github', chain = 'ethereum' } = body

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

        // Fetch repository details from GitHub
        const repoDetails = await getRepositoryDetails(accessToken, owner, repo)
        const latestCommit = await getLatestCommit(
            accessToken,
            owner,
            repo,
            repoDetails.default_branch
        )

        // Find Solidity files (this can be slow for large repos)
        let solidityFileCount = 0
        try {
            const solidityFiles = await getSolidityFiles(accessToken, owner, repo)
            solidityFileCount = solidityFiles.length
        } catch (err) {
            console.warn('Could not count Solidity files:', err)
        }

        // Create project
        const projectId = `proj_${randomUUID().slice(0, 8)}`

        // TODO: Store in database
        // For now, return mock project data
        const project = {
            project_id: projectId,
            name: repoDetails.name,
            repo_url: repoDetails.html_url,
            provider,
            chain,
            default_branch: repoDetails.default_branch,
            github_repo_id: repoDetails.id,
            github_repo_full_name: repoDetails.full_name,
            github_last_commit_sha: latestCommit.sha,
            github_last_commit_message: latestCommit.commit.message,
            github_last_commit_author: latestCommit.commit.author.name,
            github_last_commit_date: latestCommit.commit.author.date,
            solidity_file_count: solidityFileCount,
            created_at: new Date().toISOString(),
        }

        return NextResponse.json({
            message: 'Repository linked successfully',
            project,
        }, { status: 201 })
    } catch (error: any) {
        console.error('Failed to link repository:', error)
        return NextResponse.json(
            { error: 'Failed to link repository', details: error.message },
            { status: 500 }
        )
    }
}
