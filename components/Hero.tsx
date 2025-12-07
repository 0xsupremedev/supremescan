'use client'

import { motion } from 'framer-motion'
import FloatingCard from './FloatingCard'
import DashboardMock from './DashboardMock'
import Terminal from './Terminal'
import ChainBadges from './ChainBadges'
import { Play, Eye } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background Gradient with Pattern */}
      <div className="absolute inset-0 hero-gradient hexagon-pattern">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${Math.random() > 0.5 ? '98, 54, 255' : '58, 141, 255'}, ${Math.random() * 0.5 + 0.3})`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm text-gray-300">
            Trusted by Auditors, Builders & Security Researchers
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6 px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            AI-Powered Smart Contract Security
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real-time vulnerability detection, attack-surface mapping, and automated audit reports for Ethereum, EVM chains, and Solana.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-16 mb-12">
          {/* Left Side - Terminal */}
          <div className="relative">
            <Terminal />
          </div>

          {/* Right Side - Dashboard */}
          <div className="relative">
            <DashboardMock />
          </div>
        </div>

        {/* Floating Cards - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <FloatingCard
            title="AI Confidence"
            value="92%"
            icon="confidence"
            delay={0.6}
            position={{ top: '10%', right: '5%' }}
          />
          <FloatingCard
            title="Exploitability Score"
            value={87}
            icon="exploitability"
            delay={0.7}
            position={{ top: '20%', left: '5%' }}
          />
          <FloatingCard
            title="High Severity"
            value="Found"
            icon="severity"
            delay={0.8}
            position={{ bottom: '15%', right: '10%' }}
          />
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-8 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(98, 54, 255, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white text-lg flex items-center gap-2 shadow-2xl shadow-purple-500/50"
          >
            <Play size={20} fill="white" />
            Start Scan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass rounded-lg font-semibold text-white text-lg flex items-center gap-2 border-2 border-white/30"
          >
            <Eye size={20} />
            View Demo
          </motion.button>
        </motion.div>

        {/* Chain Badges */}
        <ChainBadges />

        {/* Brand Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-8"
        >
          <div className="w-12 h-12 border-2 border-white/20 rounded-lg rotate-45 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/40 rounded rotate-45"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

