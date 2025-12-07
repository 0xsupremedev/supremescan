import type React from 'react'

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'

export interface SummaryMetric {
  id: string
  label: string
  value: number
  delta?: number
  trend?: number[]
  type:
  | 'total-scanned'
  | 'high-severity'
  | 'medium-severity'
  | 'low-severity'
  | 'new-deployments'
  | 'ai-flagged'
}

export interface SeverityDistributionItem {
  severity: SeverityLevel
  count: number
}

export interface VulnerabilityTrendPoint {
  date: string // ISO date string
  critical: number
  high: number
  medium: number
  low: number
}

export interface TriageAlert {
  id: string
  contractAddress: string
  chain: string
  severity: SeverityLevel
  title: string
  description: string
  auditType: string
  detectedAt: string
}

export interface AttackSurfaceNode {
  id: string
  label: string
  type: 'contract' | 'proxy' | 'library' | 'wallet' | 'pool' | 'oracle'
  risk: 'low' | 'medium' | 'high' | 'critical'
  address?: string
  vulnerabilityCounts?: {
    high: number
    medium: number
    low: number
  }
  aiRiskScore?: number
  aiSummary?: string
  topIssues?: {
    label: string
    severity: 'high' | 'medium' | 'low'
    icon?: string
  }[]
  connectionsCount?: number
  recentTxs?: {
    hash: string
    from: string
    timestamp?: string
  }[]
}

export interface AttackSurfaceLink {
  id: string
  source: string
  target: string
  relation: 'calls' | 'delegatecalls' | 'inherits' | 'proxy-to-impl' | 'transfers' | 'interacts'
  risk?: 'low' | 'medium' | 'high' | 'critical'
}

export interface AttackSurfaceGraphData {
  network: string
  nodes: AttackSurfaceNode[]
  links: AttackSurfaceLink[]
}

export interface DashboardData {
  summaryMetrics: SummaryMetric[]
  severityDistribution: SeverityDistributionItem[]
  trends: VulnerabilityTrendPoint[]
  triageFeed: TriageAlert[]
  attackSurface: AttackSurfaceGraphData
}

export type DeploymentSeverity = 'high' | 'medium' | 'low'

export interface DeploymentRecord {
  id: string
  timestamp: string // ISO datetime
  chain: 'Ethereum' | 'Solana' | 'Polygon' | 'Other'
  contractAddress: string
  txHash: string
  deployer: string
  riskScore: number // 0-100
  severity: DeploymentSeverity
  contractType?: 'ERC-20' | 'DeFi' | 'NFT' | 'Bridge' | 'Other'
  gasUsed?: number
  compiler?: string
  deployedAt?: string
}

export type VulnerabilitySeverity = 'high' | 'medium' | 'low'
export type VulnerabilityStatus = 'new' | 'reviewed' | 'resolved'

export interface VulnerabilityReport {
  id: string // e.g., "VULN-001"
  contractAddress: string
  chain: 'Ethereum' | 'Solana' | 'Polygon' | 'Other'
  severity: VulnerabilitySeverity
  type: string // e.g., "Reentrancy", "Integer Overflow", "Unchecked Return"
  deployer?: string
  aiConfidence: number // 0-100
  status: VulnerabilityStatus
  createdAt: string // ISO datetime
  title: string // e.g., "Reentrancy in withdraw() function"
  description: string // AI-generated description
  codeSnippet: string // Code with line numbers
  codeStartLine: number
  codeEndLine: number
  remediation: string[] // Array of remediation recommendations
  compilerVersion?: string
}

export interface VulnerabilityReportsFilters {
  severity: VulnerabilitySeverity | 'all'
  status: VulnerabilityStatus | 'all'
  chain: 'Ethereum' | 'Solana' | 'Polygon' | 'Other' | 'all'
}

export type TriageStatus = 'new' | 'triaged' | 'dismissed'
export type PatternType = 'flash-loan' | 'reentrancy' | 'rug-pull' | 'token-minting' | 'other'

export interface AITriageAlert {
  id: string // e.g., "AI-TR-001"
  detectedPattern: string
  patternType: PatternType
  contractsInvolved: {
    attacker?: string
    victim?: string
    tokenContract?: string
    devWallet?: string
  }
  aiConfidence: number // 0-100
  timeDetected: string // ISO datetime
  status: TriageStatus
  aiNarrative: string
  visualEvidence: {
    entities: Array<{ id: string; label: string; type: 'protocol' | 'attacker' | 'victim' }>
    flows: Array<{ from: string; to: string; label: string; risk: 'high' | 'medium' | 'low' }>
  }
  suggestedActions: string[]
  assignedAnalyst?: string
  notes?: string
  profitAmount?: string // e.g., "15 ETH"
}

export type ChainOption = 'Ethereum' | 'Solana' | 'Polygon' | 'BSC' | 'Avalanche' | 'Arbitrum' | 'Optimism'
export type AnalysisEngine = 'slither-mythril' | 'echidna' | 'custom'

export interface ScanningPreferences {
  enabledChains: ChainOption[]
  autoScanNewDeployments: boolean
  detectCritical: boolean
  detectHighMedium: boolean
  detectLowInfo: boolean
  aiEnhancedAnalysis: boolean
  analysisEngine: AnalysisEngine
  scanDepth: number // 0-100
  recursiveAnalysis: boolean
  emailAlertOnCompletion: boolean
  slackWebhookUrl?: string
}

export type IntegrationType = 'oauth' | 'plugin'
export type IntegrationStatus = 'connected' | 'disconnected' | 'installed' | 'not-installed'

export interface Integration {
  id: string
  name: string
  description: string
  type: IntegrationType
  status: IntegrationStatus
  logo: React.ReactNode // SVG or icon component
  actionLabel: string // "Connect" or "Install Plugin"
}

export interface RepositoryConnection {
  url: string
  provider: 'github' | 'gitlab' | 'bitbucket'
}

export interface ContractTracking {
  address: string
  chain: string
}

export interface FileUpload {
  files: File[]
}