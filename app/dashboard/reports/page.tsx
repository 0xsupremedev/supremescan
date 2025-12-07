'use client'

import { useState } from 'react'
import TopNav from '@/components/dashboard/TopNav'
import Sidebar from '@/components/dashboard/Sidebar'
import ReportsFiltersBar from '@/components/dashboard/reports/ReportsFiltersBar'
import ReportsTable from '@/components/dashboard/reports/ReportsTable'
import VulnerabilityDetailsDrawer from '@/components/dashboard/reports/VulnerabilityDetailsDrawer'
import { useVulnerabilityReports, useVulnerabilityReport, VulnerabilityReportsFilters } from '@/lib/api/hooks'
import type { VulnerabilityReport } from '@/lib/types/dashboard'

export default function ReportsPage() {
  const [filters, setFilters] = useState<VulnerabilityReportsFilters>({
    severity: 'all',
    status: 'all',
    chain: 'all',
  })
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  const reports = useVulnerabilityReports(filters)
  const selectedReport = useVulnerabilityReport(selectedReportId || '')

  const handleSelect = (report: VulnerabilityReport) => {
    setSelectedReportId(report.id)
  }

  const handleClose = () => {
    setSelectedReportId(null)
  }

  const handleMarkReviewed = (id: string) => {
    // In a real app, this would call an API
    console.log('Mark as reviewed:', id)
    handleClose()
  }

  const handleAssignAnalyst = (id: string) => {
    // In a real app, this would call an API
    console.log('Assign analyst:', id)
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
            <span className="text-gray-300">Vulnerability Reports</span>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Vulnerability Reports</h1>
            <p className="text-sm text-gray-400">
              Track, triage, and resolve smart contract vulnerabilities
            </p>
          </div>

          {/* Filters */}
          <ReportsFiltersBar filters={filters} onFiltersChange={setFilters} />

          {/* Table */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className={selectedReport ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <ReportsTable reports={reports} onSelect={handleSelect} />
            </div>

            {/* Drawer - shown on desktop when report is selected */}
            {selectedReport && (
              <div className="hidden lg:block">
                <VulnerabilityDetailsDrawer
                  report={selectedReport}
                  onClose={handleClose}
                  onMarkReviewed={handleMarkReviewed}
                  onAssignAnalyst={handleAssignAnalyst}
                />
              </div>
            )}
          </div>

          {/* Mobile Drawer - overlay */}
          {selectedReport && (
            <div className="lg:hidden">
              <VulnerabilityDetailsDrawer
                report={selectedReport}
                onClose={handleClose}
                onMarkReviewed={handleMarkReviewed}
                onAssignAnalyst={handleAssignAnalyst}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

