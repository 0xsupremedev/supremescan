import { useMemo, useState, useEffect } from 'react'
import { dashboardData, vulnerabilityReports, attackSurfaceGraphDetailed, aiTriageAlerts } from '../mockData'
import type {
  AITriageAlert,
  AttackSurfaceGraphData,
  AttackSurfaceNode,
  DashboardData,
  SeverityDistributionItem,
  SummaryMetric,
  TriageAlert,
  VulnerabilityTrendPoint,
  VulnerabilityReport,
  VulnerabilitySeverity,
  VulnerabilityStatus,
  ScanningPreferences,
} from '../types/dashboard'

export function useDashboardData(): DashboardData {
  // Placeholder for future API integration
  return dashboardData
}

export function useDashboardMetrics(): SummaryMetric[] {
  const data = useDashboardData()
  return data.summaryMetrics
}

export function useVulnerabilityDistribution(): SeverityDistributionItem[] {
  const data = useDashboardData()
  return data.severityDistribution
}

export function useVulnerabilityTrends(): VulnerabilityTrendPoint[] {
  const data = useDashboardData()
  return data.trends
}

export function useLiveTriageFeed(): TriageAlert[] {
  const data = useDashboardData()
  return data.triageFeed
}

export function useAttackSurface(): AttackSurfaceGraphData {
  const data = useDashboardData()
  return data.attackSurface
}

export function useSeveritySummary() {
  const distribution = useVulnerabilityDistribution()
  const total = useMemo(
    () => distribution.reduce((sum, item) => sum + item.count, 0),
    [distribution]
  )

  return { distribution, total }
}

export interface VulnerabilityReportsFilters {
  severity?: VulnerabilitySeverity | 'all'
  status?: VulnerabilityStatus | 'all'
  chain?: string | 'all'
  dateRange?: { start?: string; end?: string }
  search?: string
}

export function useVulnerabilityReports(filters?: VulnerabilityReportsFilters): VulnerabilityReport[] {
  return useMemo(() => {
    let filtered = [...vulnerabilityReports]

    if (filters) {
      if (filters.severity && filters.severity !== 'all') {
        filtered = filtered.filter((r) => r.severity === filters.severity)
      }

      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter((r) => r.status === filters.status)
      }

      if (filters.chain && filters.chain !== 'all') {
        filtered = filtered.filter((r) => r.chain === filters.chain)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(
          (r) =>
            r.id.toLowerCase().includes(searchLower) ||
            r.contractAddress.toLowerCase().includes(searchLower) ||
            r.type.toLowerCase().includes(searchLower) ||
            r.title.toLowerCase().includes(searchLower)
        )
      }

      if (filters.dateRange?.start || filters.dateRange?.end) {
        filtered = filtered.filter((r) => {
          const reportDate = new Date(r.createdAt)
          if (filters.dateRange?.start) {
            const startDate = new Date(filters.dateRange.start)
            if (reportDate < startDate) return false
          }
          if (filters.dateRange?.end) {
            const endDate = new Date(filters.dateRange.end)
            if (reportDate > endDate) return false
          }
          return true
        })
      }
    }

    // Sort by most recent first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [filters])
}

export function useVulnerabilityReport(id: string): VulnerabilityReport | undefined {
  return useMemo(() => vulnerabilityReports.find((r) => r.id === id), [id])
}

export interface AttackSurfaceFilters {
  chain?: string | 'all'
  timeRange?: 'last-hour' | '24h' | '7d' | 'all'
  vulnerabilityFilter?: 'all' | 'high' | 'medium' | 'low'
}

export function useAttackSurfaceGraph(filters?: AttackSurfaceFilters): AttackSurfaceGraphData {
  return useMemo(() => {
    let filteredNodes = [...attackSurfaceGraphDetailed.nodes]
    let filteredLinks = [...attackSurfaceGraphDetailed.links]

    if (filters) {
      if (filters.vulnerabilityFilter && filters.vulnerabilityFilter !== 'all') {
        filteredNodes = filteredNodes.filter((node) => {
          if (filters.vulnerabilityFilter === 'high') {
            return node.risk === 'high' || node.risk === 'critical'
          }
          if (filters.vulnerabilityFilter === 'medium') {
            return node.risk === 'medium'
          }
          if (filters.vulnerabilityFilter === 'low') {
            return node.risk === 'low'
          }
          return true
        })
      }
    }

    // Filter links to only include those connecting visible nodes
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id))
    filteredLinks = filteredLinks.filter(
      (link) => visibleNodeIds.has(link.source) && visibleNodeIds.has(link.target)
    )

    return {
      ...attackSurfaceGraphDetailed,
      nodes: filteredNodes,
      links: filteredLinks,
    }
  }, [filters])
}

export function useAttackSurfaceNodeDetails(id: string): AttackSurfaceNode | undefined {
  return useMemo(() => attackSurfaceGraphDetailed.nodes.find((n) => n.id === id), [id])
}

export interface AITriageFilters {
  aiConfidence?: 'all' | 'high' | 'medium'
  patternType?: string
  status?: 'all' | 'new' | 'triaged' | 'dismissed'
  dateRange?: { start?: string; end?: string }
  search?: string
}

export function useAITriageAlerts(filters?: AITriageFilters): AITriageAlert[] {
  return useMemo(() => {
    let filtered = [...aiTriageAlerts]

    if (filters) {
      if (filters.aiConfidence && filters.aiConfidence !== 'all') {
        if (filters.aiConfidence === 'high') {
          filtered = filtered.filter((a) => a.aiConfidence >= 90)
        } else if (filters.aiConfidence === 'medium') {
          filtered = filtered.filter((a) => a.aiConfidence >= 70 && a.aiConfidence < 90)
        }
      }

      if (filters.patternType) {
        filtered = filtered.filter((a) =>
          a.detectedPattern.toLowerCase().includes(filters.patternType!.toLowerCase()) ||
          a.patternType === filters.patternType
        )
      }

      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter((a) => a.status === filters.status)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(
          (a) =>
            a.id.toLowerCase().includes(searchLower) ||
            a.detectedPattern.toLowerCase().includes(searchLower) ||
            Object.values(a.contractsInvolved).some((addr) =>
              addr?.toLowerCase().includes(searchLower)
            )
        )
      }

      if (filters.dateRange?.start || filters.dateRange?.end) {
        filtered = filtered.filter((a) => {
          const alertDate = new Date(a.timeDetected)
          if (filters.dateRange?.start) {
            const startDate = new Date(filters.dateRange.start)
            if (alertDate < startDate) return false
          }
          if (filters.dateRange?.end) {
            const endDate = new Date(filters.dateRange.end)
            if (alertDate > endDate) return false
          }
          return true
        })
      }
    }

    // Sort by most recent first
    return filtered.sort((a, b) => new Date(b.timeDetected).getTime() - new Date(a.timeDetected).getTime())
  }, [filters])
}

export function useAITriageAlert(id: string): AITriageAlert | undefined {
  return useMemo(() => aiTriageAlerts.find((a) => a.id === id), [id])
}

// Default scanning preferences
const defaultScanningPreferences: ScanningPreferences = {
  enabledChains: ['Ethereum', 'Solana', 'Polygon', 'BSC', 'Avalanche'],
  autoScanNewDeployments: false,
  detectCritical: true,
  detectHighMedium: true,
  detectLowInfo: false,
  aiEnhancedAnalysis: true,
  analysisEngine: 'slither-mythril',
  scanDepth: 50, // Medium
  recursiveAnalysis: true,
  emailAlertOnCompletion: true,
  slackWebhookUrl: '',
}

// Shared state for scanning preferences
let preferencesState: ScanningPreferences = defaultScanningPreferences
let preferencesListeners: Set<(prefs: ScanningPreferences) => void> = new Set()

export function useScanningPreferences(): ScanningPreferences {
  const [preferences, setPreferences] = useState<ScanningPreferences>(defaultScanningPreferences)

  useEffect(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scanningPreferences')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          preferencesState = parsed
          setPreferences(parsed)
        } catch {
          // If parsing fails, use defaults
        }
      }
    }

    // Subscribe to updates
    const listener = (prefs: ScanningPreferences) => {
      setPreferences(prefs)
    }
    preferencesListeners.add(listener)

    return () => {
      preferencesListeners.delete(listener)
    }
  }, [])

  return preferences
}

export function useUpdateScanningPreferences() {
  return (preferences: ScanningPreferences) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('scanningPreferences', JSON.stringify(preferences))
    }
    // Update shared state and notify listeners
    preferencesState = preferences
    preferencesListeners.forEach((listener) => listener(preferences))
    // In a real app, this would also call an API
  }
}