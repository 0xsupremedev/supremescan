'use client'

import { ZoomIn, Maximize2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttackSurfaceFilters } from '@/lib/api/hooks'

interface AttackSurfaceFiltersBarProps {
  filters: AttackSurfaceFilters
  onFiltersChange: (filters: AttackSurfaceFilters) => void
  onZoomIn?: () => void
  onFitToScreen?: () => void
  onExport?: () => void
}

export default function AttackSurfaceFiltersBar({
  filters,
  onFiltersChange,
  onZoomIn,
  onFitToScreen,
  onExport,
}: AttackSurfaceFiltersBarProps) {
  return (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Chain Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Chain:</span>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['all', 'Ethereum', 'Solana', 'Polygon'] as const).map((chain) => (
              <button
                key={chain}
                onClick={() => onFiltersChange({ ...filters, chain })}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                  (filters.chain === chain || (chain === 'all' && !filters.chain))
                    ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {chain === 'all' ? 'All' : chain}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Time Range:</span>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['last-hour', '24h', '7d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => onFiltersChange({ ...filters, timeRange: range })}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                  filters.timeRange === range
                    ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {range === 'last-hour' ? 'Last Hour' : range === '24h' ? '24h' : '7d'}
              </button>
            ))}
          </div>
        </div>

        {/* Vulnerability Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Vulnerability Filter:</span>
          <select
            value={filters.vulnerabilityFilter || 'all'}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                vulnerabilityFilter: e.target.value as 'all' | 'high' | 'medium' | 'low',
              })
            }
            className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onZoomIn}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            Zoom In
          </button>
          <button
            onClick={onFitToScreen}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Fit to Screen
          </button>
          <button
            onClick={onExport}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            title="Export Graph"
          >
            <Download className="w-3.5 h-3.5" />
            Export Graph
          </button>
        </div>
      </div>
    </div>
  )
}

