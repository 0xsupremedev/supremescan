'use client'

import { cn } from '@/lib/utils'

export type SettingsTab = 'account' | 'api-keys' | 'scanning-preferences' | 'notifications' | 'billing' | 'integrations'

interface SettingsTabsProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'api-keys', label: 'API Keys' },
    { id: 'scanning-preferences', label: 'Scanning Preferences' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'billing', label: 'Billing' },
    { id: 'integrations', label: 'Integrations' },
  ]

  return (
    <div className="border-b border-white/10 mb-6">
      <nav className="flex space-x-6" aria-label="Settings tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

