'use client'

import { useState } from 'react'
import type { Integration } from '@/lib/types/dashboard'
import IntegrationCard from './IntegrationCard'
import {
  GitHubLogo,
  BitbucketLogo,
  GitLabLogo,
  VSCodeLogo,
  RemixLogo,
  CursorLogo,
  WindsurfLogo,
  JIRALogo,
  SlackLogo,
} from './IntegrationLogos'

const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description:
      'Connect your GitHub account to automatically create issues and scan for vulnerabilities in your private repositories.',
    type: 'oauth',
    status: 'disconnected',
    logo: <GitHubLogo />,
    actionLabel: 'Connect',
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    description:
      'Connect your Bitbucket account to automatically create issues and scan for vulnerabilities in your private repositories.',
    type: 'oauth',
    status: 'disconnected',
    logo: <BitbucketLogo />,
    actionLabel: 'Connect',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description:
      'Connect your GitLab account to automatically create issues and scan for vulnerabilities in your private repositories.',
    type: 'oauth',
    status: 'disconnected',
    logo: <GitLabLogo />,
    actionLabel: 'Connect',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description:
      'Effortlessly integrate our VS Code plugin to scan code in real-time, providing instant vulnerability updates directly within your workspace.',
    type: 'plugin',
    status: 'not-installed',
    logo: <VSCodeLogo />,
    actionLabel: 'Install Plugin',
  },
  {
    id: 'remix',
    name: 'Remix',
    description:
      'Effortlessly integrate our Remix plugin to scan code in real-time, providing instant vulnerability updates directly within your workspace.',
    type: 'plugin',
    status: 'not-installed',
    logo: <RemixLogo />,
    actionLabel: 'Install Plugin',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description:
      'Integrate SolidityScan in Cursor for real-time vulnerabilities, security insights, and safer smart contract development.',
    type: 'plugin',
    status: 'not-installed',
    logo: <CursorLogo />,
    actionLabel: 'Install Plugin',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description:
      'Access SolidityScan on Windsurf to scan code, detect vulnerabilities and Gas optimization.',
    type: 'plugin',
    status: 'not-installed',
    logo: <WindsurfLogo />,
    actionLabel: 'Install Plugin',
  },
  {
    id: 'jira',
    name: 'JIRA',
    description: 'Connect JIRA to export vulnerability data for further analysis and management.',
    type: 'oauth',
    status: 'disconnected',
    logo: <JIRALogo />,
    actionLabel: 'Connect',
  },
  {
    id: 'slack',
    name: 'Slack',
    description:
      'Integrate Slack to receive real-time vulnerability updates directly within your Slack workspace.',
    type: 'oauth',
    status: 'disconnected',
    logo: <SlackLogo />,
    actionLabel: 'Connect',
  },
]

export default function Integrations() {
  const handleAction = (integration: Integration) => {
    // Placeholder handler - in a real app, this would:
    // - For OAuth: redirect to OAuth flow
    // - For plugins: open plugin installation page or download link
    console.log(`${integration.actionLabel} clicked for ${integration.name}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Manage Integrations</h2>
        <p className="text-sm text-gray-400">Connect your tools and services to enhance your workflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  )
}

