'use client'

import { useState } from 'react'
import TopNav from '@/components/dashboard/TopNav'
import Sidebar from '@/components/dashboard/Sidebar'
import AITriageFiltersBar from '@/components/dashboard/ai-triage/AITriageFiltersBar'
import AITriageTable from '@/components/dashboard/ai-triage/AITriageTable'
import AITriageDetailsPanel from '@/components/dashboard/ai-triage/AITriageDetailsPanel'
import { useAITriageAlerts, useAITriageAlert, type AITriageFilters } from '@/lib/api/hooks'

export default function AITriagePage() {
  const [filters, setFilters] = useState<AITriageFilters>({
    aiConfidence: 'all',
    status: 'all',
  })
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)

  const alerts = useAITriageAlerts(filters)
  const selectedAlert = useAITriageAlert(selectedAlertId || '')

  const handleSelect = (alert: typeof alerts[0]) => {
    setSelectedAlertId(alert.id)
  }

  const handleClose = () => {
    setSelectedAlertId(null)
  }

  const handleMarkConfirmed = (id: string) => {
    // In a real app, this would call an API
    console.log('Mark as confirmed incident:', id)
    handleClose()
  }

  const handleDismiss = (id: string) => {
    // In a real app, this would call an API
    console.log('Dismiss as false positive:', id)
    handleClose()
  }

  const handleAssignAnalyst = (id: string, analyst: string) => {
    // In a real app, this would call an API
    console.log('Assign analyst:', id, analyst)
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-gray-400">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-300">AI Insights & Triage</span>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">AI Insights / Triage</h1>
            <p className="text-sm text-gray-400">
              Review and confirm AI-detected exploit patterns
            </p>
          </div>

          {/* Filters */}
          <AITriageFiltersBar filters={filters} onFiltersChange={setFilters} />

          {/* Main Grid: Table + Details */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className={selectedAlert ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <AITriageTable
                alerts={alerts}
                selectedId={selectedAlertId}
                onSelect={handleSelect}
              />
            </div>

            {/* Details Panel - Desktop */}
            {selectedAlert && (
              <div className="hidden lg:block">
                <AITriageDetailsPanel
                  alert={selectedAlert}
                  onClose={handleClose}
                  onMarkConfirmed={handleMarkConfirmed}
                  onDismiss={handleDismiss}
                  onAssignAnalyst={handleAssignAnalyst}
                />
              </div>
            )}
          </div>

          {/* Details Panel - Mobile Overlay */}
          {selectedAlert && (
            <div className="lg:hidden">
              <AITriageDetailsPanel
                alert={selectedAlert}
                onClose={handleClose}
                onMarkConfirmed={handleMarkConfirmed}
                onDismiss={handleDismiss}
                onAssignAnalyst={handleAssignAnalyst}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

