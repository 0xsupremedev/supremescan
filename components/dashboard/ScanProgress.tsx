'use client'

import { useEffect } from 'react'
import { useScanner } from '@/hooks/useScanner'
import { Loader2, FileCode, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

interface ScanProgressProps {
    scanId: string
    onComplete?: () => void
}

export default function ScanProgress({ scanId, onComplete }: ScanProgressProps) {
    const { progress, summary, isConnected, error } = useScanner(scanId)

    useEffect(() => {
        if (progress?.status === 'completed' && onComplete) {
            onComplete()
        }
    }, [progress?.status, onComplete])

    if (error) {
        return (
            <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3 mb-3">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-red-400">Scan Failed</h3>
                </div>
                <p className="text-sm text-gray-400">{error}</p>
            </div>
        )
    }

    if (!progress) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        )
    }

    const getStatusColor = () => {
        switch (progress.status) {
            case 'completed':
                return 'text-green-400'
            case 'failed':
                return 'text-red-400'
            default:
                return 'text-purple-400'
        }
    }

    const getStatusIcon = () => {
        switch (progress.status) {
            case 'completed':
                return <CheckCircle2 className="w-6 h-6 text-green-400" />
            case 'failed':
                return <XCircle className="w-6 h-6 text-red-400" />
            default:
                return <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        }
    }

    return (
        <div className="space-y-4">
            {/* Status Header */}
            <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
                        {progress.status === 'completed' && 'Scan Completed!'}
                        {progress.status === 'failed' && 'Scan Failed'}
                        {progress.status === 'running' && 'Scan in Progress...'}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {progress.status === 'running' &&
                            `${progress.progress}% - Analyzing smart contracts (File ${progress.filesScanned} of ${progress.totalFiles})`}
                        {progress.status === 'completed' && `Found ${progress.findingsCount} potential issues`}
                    </p>
                </div>
                {!isConnected && progress.status === 'running' && (
                    <AlertCircle className="w-5 h-5 text-yellow-400" title="Connection issue" />
                )}
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`absolute inset-y-0 left-0 transition-all duration-300 ${progress.status === 'completed'
                            ? 'bg-green-500'
                            : progress.status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600'
                        }`}
                    style={{ width: `${progress.progress}%` }}
                />
                {progress.status === 'running' && (
                    <div
                        className="absolute inset-y-0 w-20 bg-white/20 animate-pulse"
                        style={{
                            left: `${Math.max(0, progress.progress - 20)}%`,
                        }}
                    />
                )}
            </div>

            {/* Current File */}
            {progress.currentFile && progress.status === 'running' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">
                        Analyzing: <span className="text-white font-mono">{progress.currentFile}</span>
                    </span>
                </div>
            )}

            {/* Summary (when completed) */}
            {progress.status === 'completed' && summary && (
                <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <div className="text-2xl font-bold text-red-400">{summary.critical}</div>
                        <div className="text-xs text-gray-400">Critical</div>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <div className="text-2xl font-bold text-orange-400">{summary.high}</div>
                        <div className="text-xs text-gray-400">High</div>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <div className="text-2xl font-bold text-yellow-400">{summary.medium}</div>
                        <div className="text-xs text-gray-400">Medium</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div className="text-2xl font-bold text-blue-400">{summary.low}</div>
                        <div className="text-xs text-gray-400">Low</div>
                    </div>
                </div>
            )}

            {/* Stats */}
            {progress.status !== 'completed' && (
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Files scanned: {progress.filesScanned} / {progress.totalFiles}</span>
                    <span>Issues found: {progress.findingsCount}</span>
                </div>
            )}
        </div>
    )
}
