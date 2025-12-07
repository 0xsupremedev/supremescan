'use client'

import { motion } from 'framer-motion'
import { useAttackSurface } from '@/lib/api/hooks'
import { cn } from '@/lib/utils'

export default function AttackSurfaceGraph() {
  const data = useAttackSurface()

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-500 text-white ring-red-500/50'
      case 'high':
        return 'bg-orange-500 text-white ring-orange-500/50'
      case 'medium':
        return 'bg-yellow-500 text-white ring-yellow-500/50'
      default:
        return 'bg-green-500 text-white ring-green-500/50'
    }
  }

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case 'proxy-to-impl':
        return 'stroke-purple-400'
      case 'calls':
        return 'stroke-blue-400'
      case 'delegatecalls':
        return 'stroke-orange-400'
      case 'inherits':
        return 'stroke-green-400'
      default:
        return 'stroke-gray-400'
    }
  }

  // Simple force-directed layout simulation
  const positions: Record<string, { x: number; y: number }> = {}
  const nodeRadius = 40
  const width = 600
  const height = 400
  const centerX = width / 2
  const centerY = height / 2

  // Place nodes in a circular layout
  data.nodes.forEach((node, index) => {
    const angle = (index / data.nodes.length) * 2 * Math.PI
    positions[node.id] = {
      x: centerX + Math.cos(angle) * 120,
      y: centerY + Math.sin(angle) * 120,
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Attack Surface Preview</h3>
        <span className="text-xs text-gray-500">{data.network}</span>
      </div>

      <div className="relative bg-deep-navy/50 rounded-lg border border-white/10 overflow-hidden" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
          {/* Links */}
          {data.links.map((link) => {
            const source = positions[link.source]
            const target = positions[link.target]
            if (!source || !target) return null

            return (
              <line
                key={link.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={getRelationColor(link.relation)}
                strokeWidth="2"
                opacity="0.4"
                markerEnd="url(#arrowhead)"
              />
            )
          })}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="rgba(255, 255, 255, 0.4)" />
            </marker>
          </defs>

          {/* Nodes */}
          {data.nodes.map((node) => {
            const pos = positions[node.id]
            if (!pos) return null

            return (
              <g key={node.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  className={cn('fill-opacity-80 ring-2', getRiskColor(node.risk))}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-semibold fill-white pointer-events-none"
                >
                  {node.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] fill-white/70 pointer-events-none"
                >
                  {node.type}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-400">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-400">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-400">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400">Low Risk</span>
        </div>
      </div>
    </motion.div>
  )
}

