'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AITriageAlert } from '@/lib/types/dashboard'

interface AITriageTableProps {
  alerts: AITriageAlert[]
  selectedId?: string | null
  onSelect: (alert: AITriageAlert) => void
}

export default function AITriageTable({ alerts, selectedId, onSelect }: AITriageTableProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
  }

  const formatContracts = (contracts: AITriageAlert['contractsInvolved']) => {
    const parts: string[] = []
    if (contracts.attacker) {
      parts.push(`${truncateAddress(contracts.attacker)} (Attacker)`)
    }
    if (contracts.victim) {
      parts.push(`${truncateAddress(contracts.victim)} (Victim)`)
    }
    if (contracts.tokenContract) {
      parts.push(`${truncateAddress(contracts.tokenContract)} (Token Contract)`)
    }
    if (contracts.devWallet) {
      parts.push(`${truncateAddress(contracts.devWallet)} (Dev Wallet)`)
    }
    return parts.join(', ')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'triaged':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      case 'dismissed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Detected Pattern</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Contract(s) Involved</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">AI Confidence</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Time Detected</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {alerts.map((alert, index) => {
              const isSelected = selectedId === alert.id
              const isNew = alert.status === 'new'
              return (
                <motion.tr
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(alert)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-purple-500/10 border-l-2 border-purple-500'
                      : 'bg-white/0 hover:bg-white/5',
                    index % 2 === 0 && !isSelected && 'bg-white/0'
                  )}
                >
                  <td className="px-4 py-3 text-xs font-mono text-gray-300">{alert.id}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-200">{alert.detectedPattern}</td>
                  <td className="px-4 py-3 text-xs text-gray-300 font-mono">
                    {formatContracts(alert.contractsInvolved)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/50">
                      {alert.aiConfidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">
                    {isHydrated ? formatTime(alert.timeDetected) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium border',
                        getStatusColor(alert.status)
                      )}
                    >
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(alert)
                      }}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5',
                        isNew
                          ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                      )}
                    >
                      <Eye className="w-3 h-3" />
                      {isNew ? 'Triage Now' : 'View Details'}
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {alerts.length === 0 && (
        <div className="p-8 text-center text-gray-400 text-sm">No AI triage alerts found</div>
      )}
    </div>
  )
}

