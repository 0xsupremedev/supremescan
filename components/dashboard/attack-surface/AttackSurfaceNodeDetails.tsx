'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttackSurfaceNode } from '@/lib/types/dashboard'

interface AttackSurfaceNodeDetailsProps {
  node: AttackSurfaceNode | null
  onClose: () => void
  onViewReport?: () => void
}

export default function AttackSurfaceNodeDetails({
  node,
  onClose,
  onViewReport,
}: AttackSurfaceNodeDetailsProps) {
  if (!node) return null

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'medium':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'low':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const totalVulnerabilities =
    (node.vulnerabilityCounts?.high ?? 0) +
    (node.vulnerabilityCounts?.medium ?? 0) +
    (node.vulnerabilityCounts?.low ?? 0)

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Details Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full lg:w-1/3 xl:w-1/4 bg-deep-navy border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">{node.label}</h2>
                  {node.address && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">
                        {truncateAddress(node.address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(node.address!)}
                        className="p-1 rounded hover:bg-white/5"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Total Vulnerabilities */}
              {node.vulnerabilityCounts && (
                <div className="glass rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-gray-300 mb-3">Total Vulnerabilities</h3>
                  <div className="text-2xl font-bold text-white mb-3">{totalVulnerabilities}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {node.vulnerabilityCounts.high > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/50">
                        {node.vulnerabilityCounts.high} High
                      </span>
                    )}
                    {node.vulnerabilityCounts.medium > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/50">
                        {node.vulnerabilityCounts.medium} Medium
                      </span>
                    )}
                    {node.vulnerabilityCounts.low > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                        {node.vulnerabilityCounts.low} Low
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* AI Risk Score */}
              {node.aiRiskScore !== undefined && (
                <div className="glass rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-gray-300 mb-2">AI Risk Score</h3>
                  <div className="text-3xl font-bold text-white mb-2">
                    {node.aiRiskScore}
                    <span className="text-lg text-gray-400">/100</span>
                  </div>
                  {node.aiSummary && (
                    <p className="text-xs text-gray-300 leading-relaxed">{node.aiSummary}</p>
                  )}
                </div>
              )}

              {/* Top Issues */}
              {node.topIssues && node.topIssues.length > 0 && (
                <div className="glass rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-gray-300 mb-3">Top Issues</h3>
                  <div className="space-y-2">
                    {node.topIssues.map((issue, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded border',
                          getSeverityColor(issue.severity)
                        )}
                      >
                        <span className="text-sm">{issue.icon || '⚠️'}</span>
                        <span className="text-xs font-medium flex-1">{issue.label}</span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-medium border',
                            getSeverityColor(issue.severity)
                          )}
                        >
                          {issue.severity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Entities */}
              {node.connectionsCount !== undefined && (
                <div className="glass rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-gray-300 mb-2">Connected Entities</h3>
                  <div className="text-xl font-bold text-white">{node.connectionsCount}</div>
                  <span className="text-xs text-gray-400">total connections</span>
                </div>
              )}

              {/* Recent Interactions */}
              {node.recentTxs && node.recentTxs.length > 0 && (
                <div className="glass rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-gray-300 mb-3">Recent Interactions</h3>
                  <div className="space-y-2">
                    {node.recentTxs.map((tx, index) => (
                      <div key={index} className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-300">{truncateAddress(tx.hash)}</span>
                          <button
                            onClick={() => copyToClipboard(tx.hash)}
                            className="p-0.5 rounded hover:bg-white/5"
                          >
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                        <div className="text-gray-400 pl-2">
                          From: <span className="font-mono">{truncateAddress(tx.from)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={onViewReport}
                className="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-lg text-white hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Full Vulnerability Report
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

