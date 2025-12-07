'use client'

import { useState } from 'react'
import { Search, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AITriageFilters } from '@/lib/api/hooks'

interface AITriageFiltersBarProps {
  filters: AITriageFilters
  onFiltersChange: (filters: AITriageFilters) => void
}

const patternSuggestions = ['Flash Loan', 'Reentrancy', 'Rug Pull', 'Token Minting', 'Oracle Manipulation']

export default function AITriageFiltersBar({ filters, onFiltersChange }: AITriageFiltersBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const [patternInput, setPatternInput] = useState(filters.patternType || '')
  const [showPatternSuggestions, setShowPatternSuggestions] = useState(false)

  const handleAIConfidenceChange = (confidence: 'all' | 'high' | 'medium') => {
    onFiltersChange({ ...filters, aiConfidence: confidence })
  }

  const handleStatusChange = (status: 'all' | 'new' | 'triaged' | 'dismissed') => {
    onFiltersChange({ ...filters, status })
  }

  const handlePatternChange = (pattern: string) => {
    setPatternInput(pattern)
    onFiltersChange({ ...filters, patternType: pattern || undefined })
    setShowPatternSuggestions(false)
  }

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const filteredSuggestions = patternInput
    ? patternSuggestions.filter((s) => s.toLowerCase().includes(patternInput.toLowerCase()))
    : patternSuggestions

  return (
    <div className="space-y-4 mb-6">
      {/* Filter Controls */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* AI Confidence */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">AI Confidence:</span>
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              {(['all', 'high', 'medium'] as const).map((confidence) => (
                <button
                  key={confidence}
                  onClick={() => handleAIConfidenceChange(confidence)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                    (filters.aiConfidence === confidence || (confidence === 'all' && !filters.aiConfidence))
                      ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {confidence === 'all' ? 'All' : confidence === 'high' ? 'High >90%' : 'Medium'}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Type */}
          <div className="flex items-center gap-2 relative">
            <span className="text-xs text-gray-400 whitespace-nowrap">Pattern Type:</span>
            <div className="relative">
              <input
                type="text"
                value={patternInput}
                onChange={(e) => {
                  setPatternInput(e.target.value)
                  handlePatternChange(e.target.value)
                  setShowPatternSuggestions(true)
                }}
                onFocus={() => setShowPatternSuggestions(true)}
                placeholder="e.g. Flash Loan, Reentrancy"
                className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-48"
              />
              {showPatternSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute mt-1 w-full rounded-lg bg-deep-navy border border-white/10 shadow-xl overflow-hidden z-10">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handlePatternChange(suggestion)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vulnerability Filter (Status) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">Vulnerability Filter:</span>
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              {(['all', 'new', 'triaged', 'dismissed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                    (filters.status === status || (status === 'all' && !filters.status))
                      ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
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
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>
    </div>
  )
}

