'use client'

import { useState, useEffect } from 'react'

export interface ScanProgress {
    scanId: string
    status: 'running' | 'completed' | 'failed'
    progress: number
    currentFile: string | null
    filesScanned: number
    totalFiles: number
    findingsCount: number
}

export interface ScanSummary {
    critical: number
    high: number
    medium: number
    low: number
    totalFindings: number
}

/**
 * Custom hook to stream scan progress via SSE
 */
export function useScanner(scanId: string | null) {
    const [progress, setProgress] = useState<ScanProgress | null>(null)
    const [summary, setSummary] = useState<ScanSummary | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!scanId) return

        let eventSource: EventSource | null = null

        try {
            // Connect to SSE endpoint
            eventSource = new EventSource(`/api/scans/${scanId}/progress`)

            eventSource.onopen = () => {
                setIsConnected(true)
                setError(null)
            }

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data)

                switch (data.type) {
                    case 'connected':
                        setIsConnected(true)
                        break

                    case 'progress':
                        setProgress({
                            scanId: data.scanId,
                            status: data.status,
                            progress: data.progress,
                            currentFile: data.currentFile,
                            filesScanned: data.filesScanned,
                            totalFiles: data.totalFiles,
                            findingsCount: data.findingsCount,
                        })
                        break

                    case 'complete':
                        setProgress(prev => prev ? { ...prev, status: data.status, progress: 100 } : null)
                        setSummary({
                            critical: data.summary.critical,
                            high: data.summary.high,
                            medium: data.summary.medium,
                            low: data.summary.low,
                            totalFindings: data.totalFindings,
                        })
                        eventSource?.close()
                        break

                    case 'error':
                        setError(data.message)
                        eventSource?.close()
                        break
                }
            }

            eventSource.onerror = (err) => {
                console.error('SSE connection error:', err)
                setError('Connection lost. Please refresh.')
                setIsConnected(false)
                eventSource?.close()
            }
        } catch (err: any) {
            setError(err.message)
        }

        // Cleanup on unmount
        return () => {
            eventSource?.close()
        }
    }, [scanId])

    return {
        progress,
        summary,
        isConnected,
        error,
    }
}
