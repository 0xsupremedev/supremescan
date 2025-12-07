import type {
  AITriageAlert,
  AttackSurfaceGraphData,
  AttackSurfaceNode,
  AttackSurfaceLink,
  DashboardData,
  SeverityDistributionItem,
  SummaryMetric,
  TriageAlert,
  VulnerabilityTrendPoint,
  VulnerabilityReport,
} from './types/dashboard'

export const summaryMetrics: SummaryMetric[] = [
  {
    id: 'total-scanned',
    label: 'Total Scanned',
    value: 12450,
    delta: 12.4,
    trend: [9000, 10000, 11000, 11800, 12450],
    type: 'total-scanned',
  },
  {
    id: 'high-severity',
    label: 'High-Severity Vulnerabilities',
    value: 42,
    trend: [30, 34, 38, 40, 42],
    type: 'high-severity',
  },
  {
    id: 'medium-severity',
    label: 'Medium-Severity Vulnerabilities',
    value: 156,
    trend: [120, 130, 140, 150, 156],
    type: 'medium-severity',
  },
  {
    id: 'low-severity',
    label: 'Low-Severity Vulnerabilities',
    value: 310,
    trend: [260, 270, 290, 300, 310],
    type: 'low-severity',
  },
  {
    id: 'new-deployments',
    label: 'New Deployments (24h)',
    value: 18,
    trend: [5, 9, 12, 15, 18],
    type: 'new-deployments',
  },
  {
    id: 'ai-flagged',
    label: 'AI-Flagged Critical',
    value: 7,
    trend: [2, 3, 4, 6, 7],
    type: 'ai-flagged',
  },
]

export const severityDistribution: SeverityDistributionItem[] = [
  { severity: 'critical', count: 12 },
  { severity: 'high', count: 30 },
  { severity: 'medium', count: 156 },
  { severity: 'low', count: 310 },
]

export const vulnerabilityTrends: VulnerabilityTrendPoint[] = Array.from({ length: 30 }).map((_, index) => {
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - (29 - index))

  return {
    date: baseDate.toISOString().slice(0, 10),
    critical: 8 + Math.round(Math.random() * 4),
    high: 25 + Math.round(Math.random() * 8),
    medium: 120 + Math.round(Math.random() * 40),
    low: 260 + Math.round(Math.random() * 70),
  }
})

export const triageFeed: TriageAlert[] = [
  {
    id: 'alert-1',
    contractAddress: '0xAb5c...9F12',
    chain: 'Ethereum Mainnet',
    severity: 'high',
    title: 'AI Alert: New attack pattern detected on Solana bridge contracts.',
    description:
      'Potential reentrancy vector across bridge escrow contracts interacting with Solana validators.',
    auditType: 'Reentrancy',
    detectedAt: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    contractAddress: '0x9f3A...cD21',
    chain: 'Polygon',
    severity: 'critical',
    title: 'Critical price oracle manipulation surface detected.',
    description: 'Single-oracle dependency with no TWAP protection on major lending pool.',
    auditType: 'Oracle Manipulation',
    detectedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'alert-3',
    contractAddress: '0x4B21...7eA9',
    chain: 'Ethereum Mainnet',
    severity: 'medium',
    title: 'Unbounded loop in rewards distribution.',
    description: 'Potential gas exhaustion vector in iterating over all stakers on every claim.',
    auditType: 'Gas / DoS',
    detectedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
]

export const attackSurface: AttackSurfaceGraphData = {
  network: 'Ethereum Mainnet',
  nodes: [
    { id: 'core-vault', label: 'CoreVault', type: 'contract', risk: 'high' },
    { id: 'proxy-vault', label: 'VaultProxy', type: 'proxy', risk: 'medium' },
    { id: 'reward-pool', label: 'RewardPool', type: 'contract', risk: 'medium' },
    { id: 'oracle', label: 'PriceOracle', type: 'contract', risk: 'critical' },
    { id: 'lib-math', label: 'MathLib', type: 'library', risk: 'low' },
  ],
  links: [
    { id: 'l1', source: 'proxy-vault', target: 'core-vault', relation: 'proxy-to-impl' },
    { id: 'l2', source: 'core-vault', target: 'reward-pool', relation: 'calls' },
    { id: 'l3', source: 'core-vault', target: 'oracle', relation: 'calls' },
    { id: 'l4', source: 'core-vault', target: 'lib-math', relation: 'delegatecalls' },
  ],
}

export const vulnerabilityReports: VulnerabilityReport[] = [
  {
    id: 'VULN-001',
    contractAddress: '0xDe9c0a4b8f3e2d1a7c9b6e5f4a3b2c1d0e9f8a7b',
    chain: 'Ethereum',
    severity: 'high',
    type: 'Reentrancy',
    deployer: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    aiConfidence: 92,
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    title: 'Reentrancy in withdraw() function',
    description:
      'The withdraw() function allows an attacker to re-enter the contract before state is updated, potentially draining funds. This occurs because the external call is made before the balance is decremented.',
    codeSnippet: `contract Vault {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= amount; // State updated after external call
    }
}`,
    codeStartLine: 145,
    codeEndLine: 152,
    remediation: [
      'Use Checks-Effects-Interactions pattern',
      'Update state before making external calls',
      'Consider using ReentrancyGuard from OpenZeppelin',
    ],
    compilerVersion: 'v0.8.19+commit.7dd6d404',
  },
  {
    id: 'VULN-002',
    contractAddress: '0x4B21a7e9b3c2d1f0e8d7c6b5a4f3e2d1c0b9a8f7',
    chain: 'Ethereum',
    severity: 'medium',
    type: 'Integer Overflow',
    deployer: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    aiConfidence: 78,
    status: 'reviewed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    title: 'Integer Overflow in mint() function',
    description:
      'The mint() function does not properly check for integer overflow when adding to totalSupply, which could lead to unexpected behavior in Solidity versions prior to 0.8.0.',
    codeSnippet: `function mint(uint256 amount) external {
    totalSupply += amount; // Potential overflow
    balances[msg.sender] += amount;
}`,
    codeStartLine: 89,
    codeEndLine: 92,
    remediation: [
      'Use SafeMath library or upgrade to Solidity >= 0.8.0',
      'Add explicit overflow checks before arithmetic operations',
    ],
    compilerVersion: 'v0.7.6+commit.7338295f',
  },
  {
    id: 'VULN-003',
    contractAddress: '0x9f3AcD21b8e7f6a5d4c3b2a1f0e9d8c7b6a5f4e3',
    chain: 'Polygon',
    severity: 'high',
    type: 'Unchecked Return',
    deployer: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    aiConfidence: 85,
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    title: 'Unchecked return value from external call',
    description:
      'The contract makes an external call without checking the return value, which could lead to silent failures and unexpected state.',
    codeSnippet: `function transferTokens(address token, uint256 amount) external {
    IERC20(token).transfer(msg.sender, amount); // Return value not checked
}`,
    codeStartLine: 203,
    codeEndLine: 205,
    remediation: [
      'Always check return values from external calls',
      'Use SafeERC20 wrapper for token transfers',
      'Revert on failed transfers',
    ],
    compilerVersion: 'v0.8.20+commit.a1b79de6',
  },
  {
    id: 'VULN-004',
    contractAddress: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
    chain: 'Solana',
    severity: 'medium',
    type: 'Access Control',
    deployer: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    aiConfidence: 65,
    status: 'reviewed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    title: 'Missing access control on critical function',
    description:
      'The setOwner() function lacks proper access control checks, allowing any address to change the contract owner.',
    codeSnippet: `function setOwner(address newOwner) external {
    owner = newOwner; // No access control
    emit OwnerChanged(owner, newOwner);
}`,
    codeStartLine: 56,
    codeEndLine: 59,
    remediation: [
      'Add onlyOwner modifier or role-based access control',
      'Use OpenZeppelin Ownable or AccessControl',
    ],
    compilerVersion: 'v0.8.19+commit.7dd6d404',
  },
  {
    id: 'VULN-005',
    contractAddress: '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4',
    chain: 'Ethereum',
    severity: 'low',
    type: 'Gas Optimization',
    deployer: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    aiConfidence: 72,
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    title: 'Inefficient storage reads in loop',
    description:
      'The function reads from storage multiple times within a loop, which is gas-inefficient and could be optimized.',
    codeSnippet: `for (uint i = 0; i < users.length; i++) {
    balances[users[i]] += rewards[users[i]]; // Multiple storage reads
}`,
    codeStartLine: 178,
    codeEndLine: 180,
    remediation: [
      'Cache storage values in memory variables',
      'Read once and reuse within the loop',
    ],
    compilerVersion: 'v0.8.20+commit.a1b79de6',
  },
  {
    id: 'VULN-006',
    contractAddress: '0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    chain: 'Polygon',
    severity: 'high',
    type: 'Oracle Manipulation',
    deployer: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
    aiConfidence: 88,
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    title: 'Single oracle dependency without TWAP',
    description:
      'The contract relies on a single price oracle without time-weighted average price (TWAP) protection, making it vulnerable to flash loan attacks.',
    codeSnippet: `function getPrice() public view returns (uint256) {
    return oracle.getPrice(); // Single oracle, no TWAP
}`,
    codeStartLine: 234,
    codeEndLine: 236,
    remediation: [
      'Implement TWAP (Time-Weighted Average Price)',
      'Use multiple oracles and compare prices',
      'Add price staleness checks',
    ],
    compilerVersion: 'v0.8.19+commit.7dd6d404',
  },
]

export const attackSurfaceGraphDetailed: AttackSurfaceGraphData = {
  network: 'Ethereum Mainnet',
  nodes: [
    {
      id: 'vulnerable-bridge',
      label: 'Vulnerable Bridge Contract',
      type: 'contract',
      risk: 'critical',
      address: '0xDe9c0a4b8f3e2d1a7c9b6e5f4a3b2c1d0e9f8a7b',
      vulnerabilityCounts: { high: 4, medium: 5, low: 3 },
      aiRiskScore: 88,
      aiSummary:
        'Unsafe withdraw()-like function enables re-entry before state updates, potentially causing fund loss.',
      topIssues: [
        { label: 'Reentrancy', severity: 'high', icon: '🔁' },
        { label: 'Unchecked External Call', severity: 'medium', icon: '⚠️' },
        { label: 'Timestamp Dependence', severity: 'low', icon: '⏱️' },
      ],
      connectionsCount: 45,
      recentTxs: [
        {
          hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b967085f',
          from: '0xAb5c31bfE0d4e8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          hash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
          from: '0xDe9c0a4b8f3e2d1a7c9b6e5f4a3b2c1d0e9f8c084e0',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
          from: '0xDe9c0a4b8f3e2d1a7c9b6e5f4a3b2c1d0e9f8c088e0',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
      ],
    },
    {
      id: 'malicious-wallet-1',
      label: 'Malicious Wallet',
      type: 'wallet',
      risk: 'critical',
      address: '0xAb5c31bfE0d4e8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      connectionsCount: 12,
      recentTxs: [
        {
          hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b967085f',
          from: '0xAb5c31bfE0d4e8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        },
      ],
    },
    {
      id: 'liquidity-pool',
      label: 'Liquidity Pool',
      type: 'pool',
      risk: 'medium',
      address: '0x4B21a7e9b3c2d1f0e8d7c6b5a4f3e2d1c0b9a8f7',
      connectionsCount: 28,
    },
    {
      id: 'user-wallet',
      label: 'User Wallet',
      type: 'wallet',
      risk: 'low',
      address: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
      connectionsCount: 3,
    },
    {
      id: 'oracle',
      label: 'Oracle',
      type: 'oracle',
      risk: 'medium',
      address: '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
      connectionsCount: 15,
    },
    {
      id: 'malicious-wallet-2',
      label: '0xAb5...',
      type: 'wallet',
      risk: 'high',
      address: '0xAb5c31bfE0d4e8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b3',
      connectionsCount: 8,
    },
  ],
  links: [
    {
      id: 'l1',
      source: 'malicious-wallet-1',
      target: 'vulnerable-bridge',
      relation: 'calls',
      risk: 'critical',
    },
    {
      id: 'l2',
      source: 'liquidity-pool',
      target: 'vulnerable-bridge',
      relation: 'transfers',
      risk: 'high',
    },
    {
      id: 'l3',
      source: 'user-wallet',
      target: 'vulnerable-bridge',
      relation: 'interacts',
      risk: 'low',
    },
    {
      id: 'l4',
      source: 'oracle',
      target: 'vulnerable-bridge',
      relation: 'calls',
      risk: 'medium',
    },
    {
      id: 'l5',
      source: 'malicious-wallet-2',
      target: 'vulnerable-bridge',
      relation: 'calls',
      risk: 'high',
    },
    {
      id: 'l6',
      source: 'vulnerable-bridge',
      target: 'liquidity-pool',
      relation: 'transfers',
      risk: 'high',
    },
  ],
}

export const aiTriageAlerts: AITriageAlert[] = [
  {
    id: 'AI-TR-001',
    detectedPattern: 'Flash Loan Attack Pattern',
    patternType: 'flash-loan',
    contractsInvolved: {
      attacker: '0xAb5c31bfE0d4e8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      victim: '0xDe9c0a4b8f3e2d1a7c9b6e5f4a3b2c1d0e9f8a7b',
    },
    aiConfidence: 95,
    timeDetected: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: 'new',
    aiNarrative:
      'AI detects a high-probability flash loan attack sequence. Contract 0xAb5... borrowed a large amount from Aave, interacted with 0xDe9..., and repaid the loan in the same transaction, netting a profit of 15 ETH. This matches known exploit patterns.',
    visualEvidence: {
      entities: [
        { id: 'aave', label: 'Aave', type: 'protocol' },
        { id: 'attacker', label: '0xAb5...', type: 'attacker' },
        { id: 'victim', label: '0xDe9...', type: 'victim' },
      ],
      flows: [
        { from: 'aave', to: 'attacker', label: 'Borrow', risk: 'high' },
        { from: 'attacker', to: 'victim', label: 'Attack Call', risk: 'high' },
        { from: 'victim', to: 'attacker', label: 'Profit Transfer', risk: 'high' },
        { from: 'attacker', to: 'aave', label: 'Repay', risk: 'medium' },
      ],
    },
    suggestedActions: [
      'Pause Contract 0xDe9... immediately.',
      'Blacklist Attacker Address 0xAb5...',
    ],
    profitAmount: '15 ETH',
  },
  {
    id: 'AI-TR-002',
    detectedPattern: 'Anomalous Token Minting',
    patternType: 'token-minting',
    contractsInvolved: {
      tokenContract: 'So1a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b',
    },
    aiConfidence: 82,
    timeDetected: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'triaged',
    aiNarrative:
      'Unusual token minting activity detected on Solana. Large volume of tokens minted without corresponding liquidity provision, indicating potential rug pull preparation.',
    visualEvidence: {
      entities: [
        { id: 'token', label: 'So1a... (Token Contract)', type: 'victim' },
        { id: 'minter', label: 'Minter Wallet', type: 'attacker' },
      ],
      flows: [
        { from: 'minter', to: 'token', label: 'Mint Tokens', risk: 'medium' },
      ],
    },
    suggestedActions: [
      'Monitor token contract for liquidity removal.',
      'Flag associated wallet addresses.',
    ],
    assignedAnalyst: 'John Doe',
  },
  {
    id: 'AI-TR-003',
    detectedPattern: 'Rug Pull Indicator (Liquidity Removal)',
    patternType: 'rug-pull',
    contractsInvolved: {
      devWallet: '0xFa8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9',
    },
    aiConfidence: 88,
    timeDetected: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: 'new',
    aiNarrative:
      'Developer wallet removed all liquidity from DEX pools within 5 minutes of deployment. This is a strong indicator of a rug pull scheme.',
    visualEvidence: {
      entities: [
        { id: 'dev', label: '0xFa8... (Dev Wallet)', type: 'attacker' },
        { id: 'pool', label: 'Liquidity Pool', type: 'victim' },
      ],
      flows: [
        { from: 'dev', to: 'pool', label: 'Remove Liquidity', risk: 'high' },
      ],
    },
    suggestedActions: [
      'Immediately blacklist developer wallet.',
      'Alert users holding tokens from this contract.',
    ],
  },
]

export const dashboardData: DashboardData = {
  summaryMetrics,
  severityDistribution,
  trends: vulnerabilityTrends,
  triageFeed,
  attackSurface,
}