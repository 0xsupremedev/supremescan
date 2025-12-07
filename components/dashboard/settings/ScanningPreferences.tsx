'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import type { ScanningPreferences, ChainOption, AnalysisEngine } from '@/lib/types/dashboard'
import MultiSelectChips from './MultiSelectChips'
import ScanIntensitySlider from './ScanIntensitySlider'
import { useUpdateScanningPreferences } from '@/lib/api/hooks'

interface ScanningPreferencesProps {
  preferences: ScanningPreferences
  onUpdate: (preferences: ScanningPreferences) => void
}

const availableChains: ChainOption[] = ['Ethereum', 'Solana', 'Polygon', 'BSC', 'Avalanche', 'Arbitrum', 'Optimism']

const analysisEngines: { value: AnalysisEngine; label: string }[] = [
  { value: 'slither-mythril', label: 'Slither & Mythril (Default)' },
  { value: 'echidna', label: 'Echidna' },
  { value: 'custom', label: 'Custom Analyzer' },
]

export default function ScanningPreferencesForm({ preferences, onUpdate }: ScanningPreferencesProps) {
  const [localPrefs, setLocalPrefs] = useState<ScanningPreferences>(preferences)
  const updateScanningPreferences = useUpdateScanningPreferences()

  const handleSave = () => {
    updateScanningPreferences(localPrefs)
    onUpdate(localPrefs)
    // Show success message (could use toast notification)
  }

  const updateField = <K extends keyof ScanningPreferences>(
    field: K,
    value: ScanningPreferences[K]
  ) => {
    setLocalPrefs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="glass rounded-xl p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Manage Scanning Preferences</h2>
        <p className="text-sm text-gray-400">Configure how SupremeScan analyzes smart contracts</p>
      </div>

      {/* Section A: Blockchain & Chain Selection */}
      <section className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Enabled Chains</label>
          <MultiSelectChips
            selected={localPrefs.enabledChains}
            available={availableChains}
            onChange={(chains) => updateField('enabledChains', chains)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoScan"
            checked={localPrefs.autoScanNewDeployments}
            onChange={(e) => updateField('autoScanNewDeployments', e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="autoScan" className="text-sm text-gray-300">
            Scan new contract deployments automatically
          </label>
        </div>
      </section>

      {/* Section B: Vulnerability Detection & Analysis */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-200">Vulnerability Detection & Analysis</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="detectCritical"
              checked={localPrefs.detectCritical}
              onChange={(e) => updateField('detectCritical', e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="detectCritical" className="text-sm text-gray-300 flex items-center gap-1.5">
              Critical Vulnerabilities (Reentrancy, Flash Loan, etc.)
              <Info className="w-3.5 h-3.5 text-gray-500" />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="detectHighMedium"
              checked={localPrefs.detectHighMedium}
              onChange={(e) => updateField('detectHighMedium', e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="detectHighMedium" className="text-sm text-gray-300 flex items-center gap-1.5">
              High & Medium Severity Issues
              <Info className="w-3.5 h-3.5 text-gray-500" />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="detectLowInfo"
              checked={localPrefs.detectLowInfo}
              onChange={(e) => updateField('detectLowInfo', e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="detectLowInfo" className="text-sm text-gray-300 flex items-center gap-1.5">
              Low & Informational Issues
              <Info className="w-3.5 h-3.5 text-gray-500" />
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <label htmlFor="aiEnhanced" className="text-sm text-gray-300">
            AI-Enhanced Analysis (Deep Learning Models)
          </label>
          <button
            type="button"
            onClick={() => updateField('aiEnhancedAnalysis', !localPrefs.aiEnhancedAnalysis)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localPrefs.aiEnhancedAnalysis ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localPrefs.aiEnhancedAnalysis ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Section C: Analysis Engine */}
      <section className="space-y-4">
        <label htmlFor="analysisEngine" className="block text-sm font-medium text-gray-200">
          Analysis Engine
        </label>
        <select
          id="analysisEngine"
          value={localPrefs.analysisEngine}
          onChange={(e) => updateField('analysisEngine', e.target.value as AnalysisEngine)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {analysisEngines.map((engine) => (
            <option key={engine.value} value={engine.value}>
              {engine.label}
            </option>
          ))}
        </select>
      </section>

      {/* Section D: Scan Intensity & Performance */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-200">Scan Intensity & Performance</h3>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-3">Scan Depth</label>
          <ScanIntensitySlider
            value={localPrefs.scanDepth}
            onChange={(value) => updateField('scanDepth', value)}
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <label htmlFor="recursiveAnalysis" className="text-sm text-gray-300">
            Recursive Analysis (Follow Calls to Other Contracts)
          </label>
          <button
            type="button"
            onClick={() => updateField('recursiveAnalysis', !localPrefs.recursiveAnalysis)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localPrefs.recursiveAnalysis ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localPrefs.recursiveAnalysis ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Section E: Notifications & Reports */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-200">Notifications & Reports</h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="emailAlert"
            checked={localPrefs.emailAlertOnCompletion}
            onChange={(e) => updateField('emailAlertOnCompletion', e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="emailAlert" className="text-sm text-gray-300">
            Email Alert on Completion
          </label>
        </div>
        <div>
          <label htmlFor="slackWebhook" className="block text-sm font-medium text-gray-200 mb-2">
            Slack Webhook URL (Optional)
          </label>
          <input
            type="text"
            id="slackWebhook"
            value={localPrefs.slackWebhookUrl || ''}
            onChange={(e) => updateField('slackWebhookUrl', e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            disabled
            className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-500 placeholder:text-gray-600 cursor-not-allowed"
          />
        </div>
      </section>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}

