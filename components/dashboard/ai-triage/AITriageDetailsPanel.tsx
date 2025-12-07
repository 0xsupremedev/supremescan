'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AITriageAlert } from '@/lib/types/dashboard'

interface AITriageDetailsPanelProps {
  alert: AITriageAlert | null
  onClose: () => void
  onMarkConfirmed?: (id: string) => void
  onDismiss?: (id: string) => void
  onAssignAnalyst?: (id: string, analyst: string) => void
}

export default function AITriageDetailsPanel({
  alert,
  onClose,
  onMarkConfirmed,
  onDismiss,
  onAssignAnalyst,
}: AITriageDetailsPanelProps) {
  if (!alert) return null

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getEntityColor = (type: string) => {
    switch (type) {
      case 'protocol':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'attacker':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'victim':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getFlowColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'stroke-red-500'
      case 'medium':
        return 'stroke-orange-500'
      case 'low':
        return 'stroke-gray-400'
      default:
        return 'stroke-gray-400'
    }
  }

  return (
    <AnimatePresence>
      {alert && (
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
                  <h2 className="text-lg font-bold text-white mb-1">
                    Triage: {alert.id} ({alert.detectedPattern})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* AI Narrative */}
              <div className="glass rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-300 mb-2">AI Narrative</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{alert.aiNarrative}</p>
              </div>

              {/* Visual Evidence */}
              <div className="glass rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-300 mb-4">Visual Evidence</h3>
                <div className="space-y-4">
                  {/* Entities */}
                  <div className="flex flex-wrap gap-2">
                    {alert.visualEvidence.entities.map((entity) => (
                      <div
                        key={entity.id}
                        className={cn(
                          'px-3 py-1.5 rounded border text-xs font-medium',
                          getEntityColor(entity.type)
                        )}
                      >
                        {entity.label}
                      </div>
                    ))}
                  </div>

                  {/* Flow Diagram */}
                  <div className="relative bg-deep-navy/80 rounded-lg p-4 border border-white/10">
                    <svg width="100%" height="200" className="overflow-visible">
                      {alert.visualEvidence.flows.map((flow, index) => {
                        const fromEntity = alert.visualEvidence.entities.find((e) => e.id === flow.from)
                        const toEntity = alert.visualEvidence.entities.find((e) => e.id === flow.to)
                        if (!fromEntity || !toEntity) return null

                        const fromIndex = alert.visualEvidence.entities.indexOf(fromEntity)
                        const toIndex = alert.visualEvidence.entities.indexOf(toEntity)
                        const x1 = 50 + fromIndex * 150
                        const y1 = 100
                        const x2 = 50 + toIndex * 150
                        const y2 = 100

                        return (
                          <g key={index}>
                            <line
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={getFlowColor(flow.risk)}
                              strokeWidth="2"
                              markerEnd="url(#arrowhead)"
                            />
                            <text
                              x={(x1 + x2) / 2}
                              y={y1 - 10}
                              textAnchor="middle"
                              className="text-[10px] fill-gray-400"
                            >
                              {flow.label}
                            </text>
                          </g>
                        )
                      })}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Suggested Actions (AI) */}
              <div className="glass rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-300 mb-3">Suggested Actions (AI)</h3>
                <ol className="space-y-2">
                  {alert.suggestedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-purple-400 mt-0.5">{index + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Human Triage Actions */}
              <div className="glass rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-semibold text-gray-300 mb-3">Human Triage Actions</h3>

                {/* Assign to Analyst */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Assign to Analyst</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value && onAssignAnalyst) {
                        onAssignAnalyst(alert.id, e.target.value)
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="">Select analyst...</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => onMarkConfirmed?.(alert.id)}
                    className="w-full px-4 py-3 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                  >
                    Mark as Confirmed Incident
                  </button>
                  <button
                    onClick={() => onDismiss?.(alert.id)}
                    className="w-full px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    Dismiss as False Positive
                  </button>
                </div>

                {/* Add Note */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Add Note</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    placeholder="Add your notes here..."
                  />
                </div>

                {/* Ask AI */}
                <button className="w-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-lg text-white hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Ask AI about this pattern...
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

