import { NextRequest, NextResponse } from 'next/server'
import { getScanProgress, generateScanSummary } from '@/lib/scanner/scanner-engine'

/**
 * GET /api/scans/[scanId]
 * Get scan details and results
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { scanId: string } }
) {
    try {
        const { scanId } = params

        const progress = getScanProgress(scanId)

        if (!progress) {
            return NextResponse.json(
                { error: 'Scan not found' },
                { status: 404 }
            )
        }

        // If scan is completed, return full summary
        if (progress.status === 'completed') {
            const summary = generateScanSummary(scanId)
            return NextResponse.json({ scan: summary })
        }

        // Otherwise return current progress
        return NextResponse.json({ scan: progress })
    } catch (error: any) {
        console.error('Failed to fetch scan:', error)
        return NextResponse.json(
            { error: 'Failed to fetch scan details' },
            { status: 500 }
        )
    }
}
