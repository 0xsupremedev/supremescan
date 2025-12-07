/**
 * GitHub API utilities for repository management
 */

export interface GitHubRepository {
    id: number
    name: string
    full_name: string
    private: boolean
    html_url: string
    description: string | null
    fork: boolean
    default_branch: string
    language: string | null
    updated_at: string
    pushed_at: string
    stargazers_count: number
}

export interface GitHubCommit {
    sha: string
    commit: {
        author: {
            name: string
            email: string
            date: string
        }
        message: string
    }
}

export interface GitHubContent {
    name: string
    path: string
    sha: string
    size: number
    type: 'file' | 'dir'
    download_url: string | null
}

/**
 * Fetch repository details
 */
export async function getRepositoryDetails(
    accessToken: string,
    owner: string,
    repo: string
): Promise<GitHubRepository> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch repository: ${response.statusText}`)
    }

    return response.json()
}

/**
 * Get latest commit from default branch
 */
export async function getLatestCommit(
    accessToken: string,
    owner: string,
    repo: string,
    branch?: string
): Promise<GitHubCommit> {
    const branchParam = branch || 'HEAD'
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${branchParam}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch latest commit: ${response.statusText}`)
    }

    return response.json()
}

/**
 * Get repository contents recursively
 */
export async function getRepositoryContents(
    accessToken: string,
    owner: string,
    repo: string,
    path = ''
): Promise<GitHubContent[]> {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch repository contents: ${response.statusText}`)
    }

    return response.json()
}

/**
 * Find all Solidity files in repository
 */
export async function getSolidityFiles(
    accessToken: string,
    owner: string,
    repo: string
): Promise<GitHubContent[]> {
    const solidityFiles: GitHubContent[] = []

    async function scanDirectory(path = ''): Promise<void> {
        const contents = await getRepositoryContents(accessToken, owner, repo, path)

        for (const item of contents) {
            if (item.type === 'file' && item.name.endsWith('.sol')) {
                solidityFiles.push(item)
            } else if (item.type === 'dir') {
                // Recursively scan subdirectories
                await scanDirectory(item.path)
            }
        }
    }

    await scanDirectory()
    return solidityFiles
}

/**
 * Get file content
 */
export async function getFileContent(
    accessToken: string,
    owner: string,
    repo: string,
    path: string
): Promise<string> {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.raw',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`)
    }

    return response.text()
}

/**
 * Parse owner and repo from GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
        /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/,
        /github\.com\/([^\/]+)\/([^\/]+)/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
            return { owner: match[1], repo: match[2] }
        }
    }

    return null
}
