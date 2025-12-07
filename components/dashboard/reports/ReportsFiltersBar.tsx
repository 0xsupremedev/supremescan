'use client'

import { useState } from 'react'
import { Search, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VulnerabilityReportsFilters } from '@/lib/api/hooks'

interface ReportsFiltersBarProps {
  filters: VulnerabilityReportsFilters
  onFiltersChange: (filters: VulnerabilityReportsFilters) => void
}

export default function ReportsFiltersBar({ filters, onFiltersChange }: ReportsFiltersBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '')

  const handleSeverityChange = (severity: 'all' | 'high' | 'medium' | 'low') => {
    onFiltersChange({ ...filters, severity })
  }

  const handleStatusChange = (status: 'all' | 'new' | 'reviewed' | 'resolved') => {
    onFiltersChange({ ...filters, status })
  }

  const handleChainChange = (chain: string) => {
    onFiltersChange({ ...filters, chain })
  }

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  return (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Severity:</span>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['all', 'high', 'medium', 'low'] as const).map((severity) => (
              <button
                key={severity}
                onClick={() => handleSeverityChange(severity)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                  filters.severity === severity || (severity === 'all' && !filters.severity)
                    ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Status:</span>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['all', 'new', 'reviewed', 'resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                  filters.status === status || (status === 'all' && !filters.status)
                    ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chain Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Chain:</span>
          <select
            value={filters.chain || 'all'}
            onChange={(e) => handleChainChange(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Solana">Solana</option>
            <option value="Polygon">Polygon</option>
          </select>
        </div>

        {/* Date Range - Simple input for now */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Date Range:</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
            <Calendar className="w-3 h-3 text-gray-400" />
            <input
              type="date"
              className="text-xs bg-transparent text-gray-300 focus:outline-none w-32"
              onChange={(e) => {
                onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value },
                })
              }}
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              className="text-xs bg-transparent text-gray-300 focus:outline-none w-32"
              onChange={(e) => {
                onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value },
                })
              }}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by contract or vulnerability ID…"
              className="w-full pl-10 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

