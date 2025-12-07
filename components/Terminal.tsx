'use client'

import { motion } from 'framer-motion'

export default function Terminal() {
  const lines = [
    { text: '$ supreme-scan --target 0x4b9...c2a1 --chain ethereum', type: 'command' },
    { text: '[INFO] Initializing SupremeScan AI...', type: 'info' },
    { text: '[INFO] Connecting to Ethereum Mainnet...', type: 'info' },
    { text: '[INFO] Fetching contract bytecode and source...', type: 'info' },
    { text: '[INFO] Starting deep static and dynamic analysis...', type: 'info' },
    { text: '[PROCESS] ...', type: 'process' },
    { text: '[SUCCESS] Analysis complete. Generating report...', type: 'success' },
    { text: '[ALERT] High Severity Vulnerability Detected: Reentrancy in withdraw()', type: 'alert' },
    { text: '[ALERT] Medium Severity Vulnerability Detected: Integer Overflow in mint()', type: 'alert' },
    { text: '[INFO] AI Confidence: 92%', type: 'info' },
    { text: '[INFO] Exploitability Score: 87', type: 'info' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="glass rounded-xl p-6 font-mono text-sm overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <span className="text-gray-400 text-xs ml-2">Terminal</span>
      </div>

      {/* Terminal Content */}
      <div className="space-y-1">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`${
              line.type === 'command' ? 'text-purple-400' :
              line.type === 'info' ? 'text-blue-400' :
              line.type === 'success' ? 'text-green-400' :
              line.type === 'alert' ? 'text-red-400' :
              'text-gray-300'
            }`}
          >
            {line.text}
          </motion.div>
        ))}
      </div>

      {/* High Severity Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg"
      >
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-red-400 font-semibold text-sm">High Severity Found</span>
      </motion.div>
    </motion.div>
  )
}

