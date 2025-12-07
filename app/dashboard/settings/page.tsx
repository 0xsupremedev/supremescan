'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import SettingsTabs, { type SettingsTab } from '@/components/dashboard/settings/SettingsTabs'
import ScanningPreferencesForm from '@/components/dashboard/settings/ScanningPreferences'
import Integrations from '@/components/dashboard/settings/Integrations'
import { useScanningPreferences } from '@/lib/api/hooks'
import type { ScanningPreferences } from '@/lib/types/dashboard'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('scanning-preferences')
  const preferences = useScanningPreferences()
  const [localPrefs, setLocalPrefs] = useState<ScanningPreferences>(preferences)

  useEffect(() => {
    setLocalPrefs(preferences)
  }, [preferences])

  const handlePreferencesUpdate = (updated: ScanningPreferences) => {
    setLocalPrefs(updated)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scanning-preferences':
        return (
          <ScanningPreferencesForm preferences={localPrefs} onUpdate={handlePreferencesUpdate} />
        )
      case 'account':
        return (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
            <p className="text-gray-400 text-sm">Account settings coming soon...</p>
          </div>
        )
      case 'api-keys':
        return (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">API Keys</h2>
            <p className="text-gray-400 text-sm">API key management coming soon...</p>
          </div>
        )
      case 'notifications':
        return (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
            <p className="text-gray-400 text-sm">Notification preferences coming soon...</p>
          </div>
        )
      case 'billing':
        return (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Billing</h2>
            <p className="text-gray-400 text-sm">Billing information coming soon...</p>
          </div>
        )
      case 'integrations':
        return <Integrations />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-deep-navy text-white">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex flex-col p-6 lg:p-8">
          <div className="mb-6">
            <nav className="text-sm text-gray-400 mb-2">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="text-gray-300">Settings</span>
            </nav>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your account and scanning preferences
            </p>
          </div>

          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}

