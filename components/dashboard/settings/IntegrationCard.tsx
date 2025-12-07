'use client'

import type { Integration } from '@/lib/types/dashboard'

interface IntegrationCardProps {
  integration: Integration
  onAction: (integration: Integration) => void
}

export default function IntegrationCard({ integration, onAction }: IntegrationCardProps) {
  return (
    <div className="glass rounded-xl p-5 flex flex-col h-full">
      {/* Logo */}
      <div className="mb-4">{integration.logo}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 flex-1">{integration.description}</p>

      {/* Action Button */}
      <button
        onClick={() => onAction(integration)}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {integration.actionLabel}
      </button>
    </div>
  )
}

