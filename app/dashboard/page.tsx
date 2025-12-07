'use client'

import TopNav from '@/components/dashboard/TopNav'
import Sidebar from '@/components/dashboard/Sidebar'
import MetricCard from '@/components/dashboard/MetricCard'
import VulnerabilityTrends from '@/components/dashboard/VulnerabilityTrends'
import LiveTriageFeed from '@/components/dashboard/LiveTriageFeed'
import AttackSurfaceGraph from '@/components/dashboard/AttackSurfaceGraph'
import { useDashboardMetrics } from '@/lib/api/hooks'

export default function DashboardPage() {
  const metrics = useDashboardMetrics()

  return (
    <div className="min-h-screen bg-deep-navy">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-sm text-gray-400">
              Holistic smart-contract security monitoring and AI-driven vulnerability detection
            </p>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <MetricCard key={metric.id} metric={metric} index={index} />
            ))}
          </div>

          {/* Vulnerability Trends */}
          <div className="mb-6">
            <VulnerabilityTrends />
          </div>

          {/* Bottom Grid: Triage Feed + Attack Surface */}
          <div className="grid lg:grid-cols-2 gap-6">
            <LiveTriageFeed />
            <AttackSurfaceGraph />
          </div>
        </main>
      </div>
    </div>
  )
}

