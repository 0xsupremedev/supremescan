'use client'

import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Shield } from 'lucide-react'

interface FloatingCardProps {
  title: string
  value: string | number
  icon: 'confidence' | 'exploitability' | 'severity'
  delay?: number
  position: { top?: string; bottom?: string; left?: string; right?: string }
}

const icons = {
  confidence: Shield,
  exploitability: TrendingUp,
  severity: AlertTriangle,
}

export default function FloatingCard({ title, value, icon, delay = 0, position }: FloatingCardProps) {
  const Icon = icons[icon]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute glass rounded-xl p-4 shadow-2xl"
      style={{
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
      }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          icon === 'confidence' ? 'bg-green-500/20 text-green-400' :
          icon === 'exploitability' ? 'bg-blue-500/20 text-blue-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-xl font-bold text-white">{value}{typeof value === 'number' ? '' : ''}</p>
        </div>
      </div>
    </motion.div>
  )
}

