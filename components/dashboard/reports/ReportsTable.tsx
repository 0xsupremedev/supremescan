'use client'

import { motion } from 'framer-motion'
import { Coins, Zap, Network, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VulnerabilityReport } from '@/lib/types/dashboard'

interface ReportsTableProps {
  reports: VulnerabilityReport[]
  onSelect: (report: VulnerabilityReport) => void
}

const chainIcons = {
  Ethereum: Coins,
  Solana: Zap,
  Polygon: Network,
  Other: Network,
}

export default function ReportsTable({ reports, onSelect }: ReportsTableProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'reviewed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Contract</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Chain</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Deployer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">AI Confidence</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reports.map((report, index) => {
              const ChainIcon = chainIcons[report.chain] || Network
              const isHighSeverity = report.severity === 'high'
              return (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(report)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    isHighSeverity
                      ? 'bg-red-500/5 hover:bg-red-500/10'
                      : 'bg-white/0 hover:bg-white/5',
                    index % 2 === 0 && 'bg-white/0'
                  )}
                >
                  <td className="px-4 py-3 text-xs font-mono text-gray-300">{report.id}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-300">
                    {truncateAddress(report.contractAddress)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ChainIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-300">{report.chain}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium border',
                        getSeverityColor(report.severity)
                      )}
                    >
                      {report.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">{report.type}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">
                    {report.deployer ? truncateAddress(report.deployer) : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">{report.aiConfidence}%</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium border',
                        getStatusColor(report.status)
                      )}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(report)
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {reports.length === 0 && (
        <div className="p-8 text-center text-gray-400 text-sm">No vulnerability reports found</div>
      )}
    </div>
  )
}

