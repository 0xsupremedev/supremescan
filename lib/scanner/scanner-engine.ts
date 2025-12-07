import { getFileContent, getSolidityFiles } from '../github/api'
import { analyzeSolidityCode, VulnerabilityFinding } from './solidity-analyzer'
import { randomUUID } from 'crypto'

export interface ScanProgress {
    scanId: string
    status: 'running' | 'completed' | 'failed'
    progress: number
    currentFile: string | null
    filesScanned: number
    totalFiles: number
    findings: VulnerabilityFinding[]
    startedAt: string
    completedAt?: string
}

export interface ScanResult {
    scanId: string
    projectId: string
    status: 'completed' | 'failed'
    findings: VulnerabilityFinding[]
    summary: {
        totalFiles: number
        totalFindings: number
        critical: number
        high: number
        medium: number
        low: number
    }
    duration: number
    completedAt: string
}

// In-memory storage for scan progress (should be replaced with database/Redis)
const scanProgressMap = new Map<string, ScanProgress>()

/**
 * Start scanning a repository
 */
export async function startRepositoryScan(
    accessToken: string,
    owner: string,
    repo: string,
    projectId: string
): Promise<string> {
    const scanId = `scan_${randomUUID().slice(0, 8)}`

    // Initialize scan progress
    const progress: ScanProgress = {
        scanId,
        status: 'running',
        progress: 0,
        currentFile: null,
        filesScanned: 0,
        totalFiles: 0,
        findings: [],
        startedAt: new Date().toISOString(),
    }

    scanProgressMap.set(scanId, progress)

    // Start scanning asynchronously
    performScan(scanId, accessToken, owner, repo, projectId).catch((error) => {
        console.error(`Scan ${scanId} failed:`, error)
        const failedProgress = scanProgressMap.get(scanId)
        if (failedProgress) {
            failedProgress.status = 'failed'
            failedProgress.completedAt = new Date().toISOString()
        }
    })

    return scanId
}

/**
 * Get scan progress
 */
export function getScanProgress(scanId: string): ScanProgress | null {
    return scanProgressMap.get(scanId) || null
}

/**
 * Perform the actual scanning
 */
async function performScan(
    scanId: string,
    accessToken: string,
    owner: string,
    repo: string,
    projectId: string
): Promise<void> {
    const progress = scanProgressMap.get(scanId)
    if (!progress) return

    try {
        // Step 1: Find all Solidity files
        progress.currentFile = 'Scanning repository for Solidity files...'
        progress.progress = 5

        const solidityFiles = await getSolidityFiles(accessToken, owner, repo)
        progress.totalFiles = solidityFiles.length
        progress.progress = 10

        if (solidityFiles.length === 0) {
            progress.status = 'completed'
            progress.progress = 100
            progress.completedAt = new Date().toISOString()
            return
        }

        // Step 2: Analyze each file
        const allFindings: VulnerabilityFinding[] = []

        for (let i = 0; i < solidityFiles.length; i++) {
            const file = solidityFiles[i]
            progress.currentFile = file.path
            progress.filesScanned = i + 1
            progress.progress = 10 + Math.floor((i / solidityFiles.length) * 85)

            try {
                // Fetch file content
                const fileContent = await getFileContent(accessToken, owner, repo, file.path)

                // Analyze for vulnerabilities
                const findings = analyzeSolidityCode(fileContent, file.path)
                allFindings.push(...findings)

                // Update progress findings
                progress.findings = allFindings

                // Small delay to prevent rate limiting
                await new Promise(resolve => setTimeout(resolve, 100))
            } catch (error) {
                console.error(`Failed to analyze file ${file.path}:`, error)
                // Continue with other files
            }
        }

        // Step 3: Complete scan
        progress.status = 'completed'
        progress.progress = 100
        progress.findings = allFindings
        progress.completedAt = new Date().toISOString()

        console.log(`Scan ${scanId} completed successfully with ${allFindings.length} findings`)
    } catch (error) {
        console.error(`Scan ${scanId} failed:`, error)
        progress.status = 'failed'
        progress.completedAt = new Date().toISOString()
        throw error
    }
}

/**
 * Generate scan result summary
 */
export function generateScanSummary(scanId: string): ScanResult | null {
    const progress = scanProgressMap.get(scanId)
    if (!progress || progress.status !== 'completed') return null

    const summary = {
        totalFiles: progress.totalFiles,
        totalFindings: progress.findings.length,
        critical: progress.findings.filter(f => f.severity === 'critical').length,
        high: progress.findings.filter(f => f.severity === 'high').length,
        medium: progress.findings.filter(f => f.severity === 'medium').length,
        low: progress.findings.filter(f => f.severity === 'low').length,
    }

    const startTime = new Date(progress.startedAt).getTime()
    const endTime = progress.completedAt ? new Date(progress.completedAt).getTime() : startTime
    const duration = Math.floor((endTime - startTime) / 1000) // seconds

    return {
        scanId: progress.scanId,
        projectId: '', // Should come from scan data
        status: 'completed',
        findings: progress.findings,
        summary,
        duration,
        completedAt: progress.completedAt || new Date().toISOString(),
    }
}
