'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Info, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react'

interface VulnerabilityFinding {
    id: string
    ruleId: string
    name: string
    severity: string
    description: string
    file: string
    lineNumber: number
    code: string
    recommendation: string
}

interface ScanReportProps {
    scanId: string
}

export default function ScanReport({ scanId }: ScanReportProps) {
    const [findings, setFindings] = useState<VulnerabilityFinding[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedFindings, setExpandedFindings] = useState<Set<string>>(new Set())
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all')

    useEffect(() => {
        fetchScanResults()
    }, [scanId])

    const fetchScanResults = async () => {
        try {
            const response = await fetch(`/api/scans/${scanId}`)
            const data = await response.json()

            if (data.scan?.findings) {
                setFindings(data.scan.findings)
            }
        } catch (error) {
            console.error('Failed to fetch scan results:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleExpanded = (findingId: string) => {
        const newExpanded = new Set(expandedFindings)
        if (newExpanded.has(findingId)) {
            newExpanded.delete(findingId)
        } else {
            newExpanded.add(findingId)
        }
        setExpandedFindings(newExpanded)
    }

    const copyCode = async (code: string, findingId: string) => {
        await navigator.clipboard.writeText(code)
        setCopiedCode(findingId)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-red-400" />
            case 'high':
                return <AlertCircle className="w-5 h-5 text-orange-400" />
            case 'medium':
                return <Info className="w-5 h-5 text-yellow-400" />
            case 'low':
                return <CheckCircle2 className="w-5 h-5 text-blue-400" />
            default:
                return null
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return 'bg-red-500/10 border-red-500/30 text-red-400'
            case 'high':
                return 'bg-orange-500/10 border-orange-500/30 text-orange-400'
            case 'medium':
                return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            case 'low':
                return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            default:
                return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
        }
    }

    const filteredFindings = selectedSeverity === 'all'
        ? findings
        : findings.filter(f => f.severity.toLowerCase() === selectedSeverity.toLowerCase())

    const summary = {
        total: findings.length,
        critical: findings.filter(f => f.severity.toLowerCase() === 'critical').length,
        high: findings.filter(f => f.severity.toLowerCase() === 'high').length,
        medium: findings.filter(f => f.severity.toLowerCase() === 'medium').length,
        low: findings.filter(f => f.severity.toLowerCase() === 'low').length,
    }

    if (isLoading) {
        return <div className="text-center text-gray-400 py-8">Loading scan results...</div>
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-5 gap-3">
                <button
                    onClick={() => setSelectedSeverity('all')}
                    className={`p-4 rounded-lg border transition-all ${selectedSeverity === 'all'
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                >
                    <div className="text-2xl font-bold text-white">{summary.total}</div>
                    <div className="text-xs text-gray-400">Total</div>
                </button>
                <button
                    onClick={() => setSelectedSeverity('critical')}
                    className={`p-4 rounded-lg border transition-all ${selectedSeverity === 'critical'
                        ? 'bg-red-500/20 border-red-500/50'
                        : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                        }`}
                >
                    <div className="text-2xl font-bold text-red-400">{summary.critical}</div>
                    <div className="text-xs text-gray-400">Critical</div>
                </button>
                <button
                    onClick={() => setSelectedSeverity('high')}
                    className={`p-4 rounded-lg border transition-all ${selectedSeverity === 'high'
                        ? 'bg-orange-500/20 border-orange-500/50'
                        : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
                        }`}
                >
                    <div className="text-2xl font-bold text-orange-400">{summary.high}</div>
                    <div className="text-xs text-gray-400">High</div>
                </button>
                <button
                    onClick={() => setSelectedSeverity('medium')}
                    className={`p-4 rounded-lg border transition-all ${selectedSeverity === 'medium'
                        ? 'bg-yellow-500/20 border-yellow-500/50'
                        : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                        }`}
                >
                    <div className="text-2xl font-bold text-yellow-400">{summary.medium}</div>
                    <div className="text-xs text-gray-400">Medium</div>
                </button>
                <button
                    onClick={() => setSelectedSeverity('low')}
                    className={`p-4 rounded-lg border transition-all ${selectedSeverity === 'low'
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                        }`}
                >
                    <div className="text-2xl font-bold text-blue-400">{summary.low}</div>
                    <div className="text-xs textgray-400">Low</div>
                </button>
            </div>

            {/* Findings List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                    {selectedSeverity === 'all' ? 'All Findings' : `${selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)} Severity`}
                    <span className="ml-2 text-sm text-gray-400">({filteredFindings.length})</span>
                </h3>

                {filteredFindings.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No findings in this category</p>
                ) : (
                    filteredFindings.map((finding) => (
                        <div
                            key={finding.id}
                            className={`p-4 rounded-lg border ${getSeverityColor(finding.severity)}`}
                        >
                            {/* Finding Header */}
                            <div
                                className="flex items-start justify-between gap-3 cursor-pointer"
                                onClick={() => toggleExpanded(finding.id)}
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    {getSeverityIcon(finding.severity)}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-white">{finding.name}</h4>
                                            <span className="px-2 py-0.5 text-xs rounded border uppercase"
                                                style={{
                                                    borderColor: `var(--${finding.severity}-500)`,
                                                    backgroundColor: `var(--${finding.severity}-500-10)`,
                                                }}>
                                                {finding.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm opacity-90 mb-2">{finding.description}</p>
                                        <div className="flex items-center gap-4 text-xs opacity-70">
                                            <span className="font-mono">{finding.file}</span>
                                            <span>Line {finding.lineNumber}</span>
                                            <span>{finding.ruleId}</span>
                                        </div>
                                    </div>
                                </div>
                                {expandedFindings.has(finding.id) ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </div>

                            {/* Expanded Details */}
                            {expandedFindings.has(finding.id) && (
                                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                    {/* Code Snippet */}
                                    {finding.code && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold opacity-70">Code Snippet</span>
                                                <button
                                                    onClick={() => copyCode(finding.code, finding.id)}
                                                    className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-white/10 transition-colors"
                                                >
                                                    {copiedCode === finding.id ? (
                                                        <>
                                                            <Check className="w-3 h-3" />
                                                            Copied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            Copy
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <pre className="p-3 rounded bg-black/30 text-xs font-mono overflow-x-auto">
                                                <code>{finding.code}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Recommendation */}
                                    <div>
                                        <span className="text-xs font-semibold opacity-70 block mb-2">Recommendation</span>
                                        <p className="text-sm opacity-90 bg-black/30 p-3 rounded">
                                            {finding.recommendation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
