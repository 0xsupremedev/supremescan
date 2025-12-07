import { query } from '../database/pool'

export interface Project {
    id: number
    project_id: string
    name: string
    repo_url?: string
    provider?: string
    chain?: string
    user_id: string
    visibility?: string
    default_branch?: string
    github_repo_id?: number
    github_repo_full_name?: string
    github_last_commit_sha?: string
    github_last_commit_message?: string
    github_last_commit_date?: Date
    solidity_file_count?: number
    created_at: Date
    updated_at: Date
}

/**
 * Create a new project
 */
export async function createProject(
    projectId: string,
    userId: string,
    name: string,
    repoUrl: string,
    provider: string,
    chain: string,
    githubData?: {
        repoId: number
        fullName: string
        defaultBranch: string
        lastCommitSha: string
        lastCommitMessage: string
        lastCommitDate: string
        solidityFileCount: number
    }
): Promise<Project> {
    const result = await query<Project>(
        `INSERT INTO projects (
      project_id, user_id, name, repo_url, provider, chain,
      default_branch, github_repo_id, github_repo_full_name,
      github_last_commit_sha, github_last_commit_message,
      github_last_commit_date, solidity_file_count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
        [
            projectId,
            userId,
            name,
            repoUrl,
            provider,
            chain,
            githubData?.defaultBranch || 'main',
            githubData?.repoId,
            githubData?.fullName,
            githubData?.lastCommitSha,
            githubData?.lastCommitMessage,
            githubData?.lastCommitDate,
            githubData?.solidityFileCount || 0,
        ]
    )
    return result.rows[0]
}

/**
 * Get user's projects
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
    const result = await query<Project>(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC',
        [userId]
    )
    return result.rows
}

/**
 * Get project by ID
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
    const result = await query<Project>(
        'SELECT * FROM projects WHERE project_id = $1 LIMIT 1',
        [projectId]
    )
    return result.rows[0] || null
}

/**
 * Update project's last commit info
 */
export async function updateProjectCommit(
    projectId: string,
    commitSha: string,
    commitMessage: string,
    commitDate: string
): Promise<void> {
    await query(
        `UPDATE projects
     SET github_last_commit_sha = $1,
         github_last_commit_message = $2,
         github_last_commit_date = $3,
         updated_at = NOW()
     WHERE project_id = $4`,
        [commitSha, commitMessage, commitDate, projectId]
    )
}
