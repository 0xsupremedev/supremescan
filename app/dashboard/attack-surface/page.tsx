'use client'

import { useState } from 'react'
import TopNav from '@/components/dashboard/TopNav'
import Sidebar from '@/components/dashboard/Sidebar'
import AttackSurfaceFiltersBar from '@/components/dashboard/attack-surface/AttackSurfaceFiltersBar'
import AttackSurfaceNetwork from '@/components/dashboard/attack-surface/AttackSurfaceNetwork'
import AttackSurfaceNodeDetails from '@/components/dashboard/attack-surface/AttackSurfaceNodeDetails'
import { useAttackSurfaceGraph, useAttackSurfaceNodeDetails, type AttackSurfaceFilters } from '@/lib/api/hooks'
import { useRouter } from 'next/navigation'
import type { AttackSurfaceNode } from '@/lib/types/dashboard'

export default function AttackSurfacePage() {
  const router = useRouter()
  const [filters, setFilters] = useState<AttackSurfaceFilters>({
    chain: 'all',
    timeRange: 'last-hour',
    vulnerabilityFilter: 'all',
  })
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const graphData = useAttackSurfaceGraph(filters)
  const selectedNode = useAttackSurfaceNodeDetails(selectedNodeId || '')

  const handleNodeClick = (node: AttackSurfaceNode) => {
    setSelectedNodeId(node.id)
  }

  const handleClose = () => {
    setSelectedNodeId(null)
  }

  const handleZoomIn = () => {
    // In a real app, this would control zoom state
    console.log('Zoom in')
  }

  const handleFitToScreen = () => {
    // In a real app, this would reset zoom/pan
    console.log('Fit to screen')
  }

  const handleExport = () => {
    // In a real app, this would export the graph
    console.log('Export graph')
  }

  const handleViewReport = () => {
    // Navigate to vulnerability reports page
    router.push('/dashboard/reports')
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
            <span className="text-gray-300">Attack Surface Map</span>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Attack Surface Map</h1>
            <p className="text-sm text-gray-400">
              Visualize call paths, dependencies, and high-risk entities across your protocol
            </p>
          </div>

          {/* Filters */}
          <AttackSurfaceFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            onZoomIn={handleZoomIn}
            onFitToScreen={handleFitToScreen}
            onExport={handleExport}
          />

          {/* Main Grid: Graph + Details */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className={selectedNode ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <AttackSurfaceNetwork
                graphData={graphData}
                onNodeClick={handleNodeClick}
                selectedNodeId={selectedNodeId}
              />
            </div>

            {/* Node Details - Desktop */}
            {selectedNode && (
              <div className="hidden lg:block">
                <AttackSurfaceNodeDetails
                  node={selectedNode}
                  onClose={handleClose}
                  onViewReport={handleViewReport}
                />
              </div>
            )}
          </div>

          {/* Node Details - Mobile Overlay */}
          {selectedNode && (
            <div className="lg:hidden">
              <AttackSurfaceNodeDetails
                node={selectedNode}
                onClose={handleClose}
                onViewReport={handleViewReport}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

