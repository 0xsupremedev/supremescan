import { NextRequest } from 'next/server'
import { getScanProgress } from '@/lib/scanner/scanner-engine'

/**
 * GET /api/scans/[scanId]/progress
 * Stream scan progress using Server-Sent Events (SSE)
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { scanId: string } }
) {
    const { scanId } = params

    // Create a readable stream for SSE
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            try {
                // Send initial connection message
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

                // Poll for progress updates
                const interval = setInterval(() => {
                    const progress = getScanProgress(scanId)

                    if (!progress) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Scan not found' })}\n\n`))
                        clearInterval(interval)
                        controller.close()
                        return
                    }

                    // Send progress update
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'progress',
                        scanId: progress.scanId,
                        status: progress.status,
                        progress: progress.progress,
                        currentFile: progress.currentFile,
                        filesScanned: progress.filesScanned,
                        totalFiles: progress.totalFiles,
                        findingsCount: progress.findings.length,
                    })}\n\n`))

                    // If scan is completed or failed, send final message and close
                    if (progress.status === 'completed' || progress.status === 'failed') {
                        const summary = {
                            critical: progress.findings.filter(f => f.severity === 'critical').length,
                            high: progress.findings.filter(f => f.severity === 'high').length,
                            medium: progress.findings.filter(f => f.severity === 'medium').length,
                            low: progress.findings.filter(f => f.severity === 'low').length,
                        }

                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'complete',
                            status: progress.status,
                            summary,
                            totalFindings: progress.findings.length,
                        })}\n\n`))

                        clearInterval(interval)
                        controller.close()
                    }
                }, 1000) // Update every second

                // Cleanup on client disconnect
                req.signal.addEventListener('abort', () => {
                    clearInterval(interval)
                    controller.close()
                })
            } catch (error) {
                console.error('SSE error:', error)
                controller.error(error)
            }
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
}
