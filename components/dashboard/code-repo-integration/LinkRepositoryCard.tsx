'use client'

import { useState } from 'react'
import { GitHubLogo, GitLabLogo, BitbucketLogo } from '@/components/dashboard/settings/IntegrationLogos'
import type { RepositoryConnection } from '@/lib/types/dashboard'

export default function LinkRepositoryCard() {
  const [url, setUrl] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<'github' | 'gitlab' | 'bitbucket' | null>(null)

  const handleConnect = () => {
    if (!url.trim()) {
      alert('Please enter a repository URL')
      return
    }
    if (!selectedProvider) {
      alert('Please select a provider')
      return
    }
    const connection: RepositoryConnection = {
      url: url.trim(),
      provider: selectedProvider,
    }
    console.log('Connecting repository:', connection)
    // In a real app, this would trigger OAuth flow or API call
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Project</h3>
        <h4 className="text-base font-medium text-gray-700">Link a Repository</h4>
      </div>

      {/* Provider Logos */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setSelectedProvider('github')}
          className={`p-2 rounded-lg transition-all ${
            selectedProvider === 'github'
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
        >
          <GitHubLogo />
        </button>
        <button
          onClick={() => setSelectedProvider('gitlab')}
          className={`p-2 rounded-lg transition-all ${
            selectedProvider === 'gitlab'
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
        >
          <GitLabLogo />
        </button>
        <button
          onClick={() => setSelectedProvider('bitbucket')}
          className={`p-2 rounded-lg transition-all ${
            selectedProvider === 'bitbucket'
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
        >
          <BitbucketLogo />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        Connect your private or public repositories to scan for vulnerabilities.
      </p>

      {/* Repository URL Input */}
      <div className="mb-4">
        <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-2">
          Repository URL
        </label>
        <input
          id="repo-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/user/repo"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors mt-auto"
      >
        Connect
      </button>
    </div>
  )
}

