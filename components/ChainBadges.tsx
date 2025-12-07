'use client'

import { motion } from 'framer-motion'
import { Coins, Network, Zap } from 'lucide-react'

const chains = [
  { name: 'Ethereum', icon: Coins, color: 'from-blue-500 to-blue-600' },
  { name: 'EVM Chains', icon: Network, color: 'from-purple-500 to-purple-600' },
  { name: 'Solana', icon: Zap, color: 'from-green-500 to-green-600' },
]

export default function ChainBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="flex items-center justify-center gap-4 flex-wrap"
    >
      {chains.map((chain, index) => {
        const Icon = chain.icon
        return (
          <motion.div
            key={chain.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${chain.color} glass border border-white/20`}
          >
            <Icon size={16} className="text-white" />
            <span className="text-sm font-medium text-white">{chain.name}</span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

