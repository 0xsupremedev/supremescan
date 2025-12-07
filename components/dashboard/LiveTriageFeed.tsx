'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Sparkles, ExternalLink } from 'lucide-react'
import { useLiveTriageFeed } from '@/lib/api/hooks'
import { cn } from '@/lib/utils'

export default function LiveTriageFeed() {
  const feed = useLiveTriageFeed()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Live Triage Feed & AI Insights
        </h3>
        <span className="text-xs text-gray-500">Real-time intelligence</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {feed.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="glass-strong rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={cn('p-2 rounded-lg border', getSeverityColor(alert.severity))}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">{alert.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{alert.description}</p>
                  </div>
                  <span className={cn('px-2 py-1 rounded text-xs font-medium border', getSeverityColor(alert.severity))}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-mono">{alert.contractAddress}</span>
                    <span className="text-gray-600">•</span>
                    <span>{alert.chain}</span>
                    <span className="text-gray-600">•</span>
                    <span>{alert.auditType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{formatTime(alert.detectedAt)}</span>
                    <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      AI Analyze
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

