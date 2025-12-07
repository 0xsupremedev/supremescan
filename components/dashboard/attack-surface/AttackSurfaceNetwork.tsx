'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { AttackSurfaceGraphData, AttackSurfaceNode } from '@/lib/types/dashboard'
import { cn } from '@/lib/utils'

interface AttackSurfaceNetworkProps {
  graphData: AttackSurfaceGraphData
  onNodeClick: (node: AttackSurfaceNode) => void
  selectedNodeId?: string | null
}

export default function AttackSurfaceNetwork({
  graphData,
  onNodeClick,
  selectedNodeId,
}: AttackSurfaceNetworkProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Calculate positions for nodes in a force-directed layout
  const width = 800
  const height = 600
  const centerX = width / 2
  const centerY = height / 2

  // Find the vulnerable bridge contract and place it at center
  const vulnerableBridge = graphData.nodes.find((n) => n.id === 'vulnerable-bridge')
  const positions: Record<string, { x: number; y: number }> = {}

  if (vulnerableBridge) {
    positions[vulnerableBridge.id] = { x: centerX, y: centerY }
  }

  // Place other nodes around the center
  const otherNodes = graphData.nodes.filter((n) => n.id !== 'vulnerable-bridge')
  otherNodes.forEach((node, index) => {
    const angle = (index / otherNodes.length) * 2 * Math.PI
    const radius = 180
    positions[node.id] = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    }
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return { fill: 'fill-red-500', stroke: 'stroke-red-400', glow: 'shadow-red-500/50' }
      case 'high':
        return { fill: 'fill-red-500', stroke: 'stroke-red-400', glow: 'shadow-red-500/50' }
      case 'medium':
        return { fill: 'fill-orange-500', stroke: 'stroke-orange-400', glow: 'shadow-orange-500/50' }
      case 'low':
        return { fill: 'fill-yellow-500', stroke: 'stroke-yellow-400', glow: 'shadow-yellow-500/50' }
      default:
        return { fill: 'fill-blue-500', stroke: 'stroke-blue-400', glow: 'shadow-blue-500/50' }
    }
  }

  const getNodeSize = (node: AttackSurfaceNode) => {
    if (node.id === 'vulnerable-bridge') return 60
    if (node.risk === 'critical' || node.risk === 'high') return 40
    if (node.risk === 'medium') return 32
    return 24
  }

  const getLinkColor = (link: typeof graphData.links[0]) => {
    if (link.risk === 'critical' || link.risk === 'high') return 'stroke-red-500'
    if (link.risk === 'medium') return 'stroke-orange-500'
    return 'stroke-gray-400'
  }

  const getLinkWidth = (link: typeof graphData.links[0]) => {
    if (link.risk === 'critical' || link.risk === 'high') return 3
    if (link.risk === 'medium') return 2
    return 1
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      isDragging.current = true
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const truncateLabel = (label: string, maxLength: number = 20) => {
    if (label.length <= maxLength) return label
    return label.slice(0, maxLength) + '...'
  }

  return (
    <div className="glass rounded-xl p-6 overflow-hidden relative">
      <div
        className="relative bg-deep-navy/80 rounded-lg border border-white/10 overflow-hidden"
        style={{ height: `${height}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center',
          }}
        >
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

          {/* Links */}
          {graphData.links.map((link) => {
            const source = positions[link.source]
            const target = positions[link.target]
            if (!source || !target) return null

            const isHighlighted =
              hoveredNodeId === link.source ||
              hoveredNodeId === link.target ||
              selectedNodeId === link.source ||
              selectedNodeId === link.target

            return (
              <line
                key={link.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={getLinkColor(link)}
                strokeWidth={getLinkWidth(link)}
                opacity={isHighlighted ? 0.8 : 0.4}
                markerEnd="url(#arrowhead)"
                className="transition-opacity"
              />
            )
          })}

          {/* Nodes */}
          {graphData.nodes.map((node) => {
            const pos = positions[node.id]
            if (!pos) return null

            const colors = getRiskColor(node.risk)
            const size = getNodeSize(node)
            const isSelected = selectedNodeId === node.id
            const isHovered = hoveredNodeId === node.id

            return (
              <g key={node.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  className={cn(
                    colors.fill,
                    colors.stroke,
                    'stroke-2 cursor-pointer transition-all',
                    isSelected && 'ring-4 ring-purple-400/50',
                    isHovered && 'ring-2 ring-white/50',
                    `shadow-lg ${colors.glow}`
                  )}
                  onClick={() => onNodeClick(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                />
                <text
                  x={pos.x}
                  y={pos.y + size + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-semibold fill-white pointer-events-none"
                >
                  {truncateLabel(node.label, 15)}
                </text>
                {node.address && (
                  <text
                    x={pos.x}
                    y={pos.y + size + 28}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[10px] font-mono fill-white/60 pointer-events-none"
                  >
                    {node.address.slice(0, 6)}...{node.address.slice(-4)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

