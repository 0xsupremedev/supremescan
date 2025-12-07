'use client'

import { motion } from 'framer-motion'

export default function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="glass rounded-xl p-6 space-y-4"
    >
      {/* Dashboard Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Heatmap Placeholder */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-strong rounded-lg p-4 h-32 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2">Vulnerability Heatmap</div>
            <div className="flex gap-1 justify-center">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded ${
                    i < 4 ? 'bg-red-500/60' :
                    i < 8 ? 'bg-orange-500/60' :
                    i < 12 ? 'bg-yellow-500/60' :
                    'bg-green-500/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pie Chart Placeholder */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-strong rounded-lg p-4 h-32 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2">Severity Distribution</div>
            <div className="relative w-20 h-20 mx-auto">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(239, 68, 68, 0.3)"
                  strokeWidth="20"
                  strokeDasharray={`${40 * 2 * Math.PI * 0.3} ${40 * 2 * Math.PI}`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(249, 115, 22, 0.3)"
                  strokeWidth="20"
                  strokeDasharray={`${40 * 2 * Math.PI * 0.4} ${40 * 2 * Math.PI}`}
                  strokeDashoffset={-40 * 2 * Math.PI * 0.3}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(234, 179, 8, 0.3)"
                  strokeWidth="20"
                  strokeDasharray={`${40 * 2 * Math.PI * 0.3} ${40 * 2 * Math.PI}`}
                  strokeDashoffset={-40 * 2 * Math.PI * 0.7}
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Network Graph Placeholder */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-strong rounded-lg p-4 h-32 flex items-center justify-center col-span-2"
        >
          <div className="text-center w-full">
            <div className="text-xs text-gray-400 mb-2">Attack Surface Graph</div>
            <div className="relative h-20">
              {/* Simple node graph visualization */}
              <svg viewBox="0 0 200 80" className="w-full h-full">
                {/* Nodes */}
                <circle cx="40" cy="40" r="8" fill="#6236FF" className="animate-pulse" />
                <circle cx="100" cy="20" r="8" fill="#3A8DFF" />
                <circle cx="100" cy="60" r="8" fill="#3A8DFF" />
                <circle cx="160" cy="40" r="8" fill="#6236FF" />
                {/* Edges */}
                <line x1="48" y1="40" x2="92" y2="20" stroke="#6236FF" strokeWidth="2" opacity="0.5" />
                <line x1="48" y1="40" x2="92" y2="60" stroke="#6236FF" strokeWidth="2" opacity="0.5" />
                <line x1="108" y1="20" x2="152" y2="40" stroke="#3A8DFF" strokeWidth="2" opacity="0.5" />
                <line x1="108" y1="60" x2="152" y2="40" stroke="#3A8DFF" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Risk Score Gauge */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-strong rounded-lg p-4 h-32 flex items-center justify-center col-span-2"
        >
          <div className="text-center w-full">
            <div className="text-xs text-gray-400 mb-2">Live Contract Risk Score</div>
            <div className="relative w-24 h-24 mx-auto">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${40 * 2 * Math.PI * 0.87} ${40 * 2 * Math.PI}`}
                  initial={{ strokeDashoffset: 40 * 2 * Math.PI }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6236FF" />
                    <stop offset="100%" stopColor="#3A8DFF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">87</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">/ 100</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

