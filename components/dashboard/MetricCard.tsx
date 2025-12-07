'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Brain, AlertTriangle } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { SummaryMetric } from '@/lib/types/dashboard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

interface MetricCardProps {
  metric: SummaryMetric
  index: number
}

export default function MetricCard({ metric, index }: MetricCardProps) {
  const getColorConfig = () => {
    switch (metric.type) {
      case 'total-scanned':
        return {
          bg: 'from-green-500/20 to-emerald-500/20',
          ring: 'ring-green-500/30',
          text: 'text-green-400',
          progress: 'bg-green-500',
          chartColor: 'rgba(34, 197, 94, 0.5)',
        }
      case 'high-severity':
        return {
          bg: 'from-red-500/20 to-rose-500/20',
          ring: 'ring-red-500/30',
          text: 'text-red-400',
          progress: 'bg-red-500',
          chartColor: 'rgba(239, 68, 68, 0.5)',
        }
      case 'medium-severity':
        return {
          bg: 'from-orange-500/20 to-amber-500/20',
          ring: 'ring-orange-500/30',
          text: 'text-orange-400',
          progress: 'bg-orange-500',
          chartColor: 'rgba(249, 115, 22, 0.5)',
        }
      case 'low-severity':
        return {
          bg: 'from-yellow-500/20 to-lime-500/20',
          ring: 'ring-yellow-500/30',
          text: 'text-yellow-400',
          progress: 'bg-yellow-500',
          chartColor: 'rgba(234, 179, 8, 0.5)',
        }
      case 'new-deployments':
        return {
          bg: 'from-blue-500/20 to-cyan-500/20',
          ring: 'ring-blue-500/30',
          text: 'text-blue-400',
          progress: 'bg-blue-500',
          chartColor: 'rgba(59, 130, 246, 0.5)',
        }
      case 'ai-flagged':
        return {
          bg: 'from-purple-500/20 to-pink-500/20',
          ring: 'ring-purple-500/30',
          text: 'text-purple-400',
          progress: 'bg-purple-500',
          chartColor: 'rgba(168, 85, 247, 0.5)',
        }
      default:
        return {
          bg: 'from-gray-500/20 to-slate-500/20',
          ring: 'ring-gray-500/30',
          text: 'text-gray-400',
          progress: 'bg-gray-500',
          chartColor: 'rgba(107, 114, 128, 0.5)',
        }
    }
  }

  const colors = getColorConfig()

  const renderVisualization = () => {
    if (metric.type === 'total-scanned' && metric.delta) {
      // Progress bar for total scanned
      const progress = Math.min((metric.value / 15000) * 100, 100)
      return (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={`h-full ${colors.progress} rounded-full`}
            />
          </div>
          {metric.delta && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">+{metric.delta}%</span>
            </div>
          )}
        </div>
      )
    }

    if (metric.type === 'new-deployments' && metric.trend) {
      // Mini line chart for new deployments
      const chartData = {
        labels: metric.trend.map((_, i) => ''),
        datasets: [
          {
            data: metric.trend,
            borderColor: colors.chartColor,
            backgroundColor: colors.chartColor.replace('0.5', '0.1'),
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      }
      return (
        <div className="mt-3 h-12">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                x: { display: false },
                y: { display: false },
              },
            }}
          />
        </div>
      )
    }

    if (metric.type === 'ai-flagged') {
      // AI brain icon for AI-flagged
      return (
        <div className="mt-3 flex items-center justify-center">
          <div className={`p-3 rounded-full ${colors.bg} ${colors.ring} ring-2`}>
            <Brain className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>
      )
    }

    // Ring chart for severity metrics
    if (metric.trend && metric.trend.length > 0) {
      const lastValue = metric.trend[metric.trend.length - 1]
      const maxValue = Math.max(...metric.trend, lastValue * 1.2)
      const percentage = (lastValue / maxValue) * 100

      return (
        <div className="mt-3 relative w-16 h-16 mx-auto">
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
              stroke={colors.chartColor.replace('0.5', '1')}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100) }}
              transition={{ delay: index * 0.1, duration: 1 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${colors.text}`}>{metric.value}</span>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass rounded-xl p-5 border border-white/10 ${colors.ring} ring-1`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
          <p className={`text-2xl font-bold ${colors.text}`}>
            {metric.value.toLocaleString()}
          </p>
        </div>
      </div>
      {renderVisualization()}
    </motion.div>
  )
}

