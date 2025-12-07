'use client'

import TopNav from '@/components/dashboard/TopNav'
import LinkRepositoryCard from '@/components/dashboard/code-repo-integration/LinkRepositoryCard'
import TrackContractCard from '@/components/dashboard/code-repo-integration/TrackContractCard'
import UploadFilesCard from '@/components/dashboard/code-repo-integration/UploadFilesCard'
import { Activity, AlertTriangle, Code, FileText, Map, Settings, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useThemePreference } from '@/components/ThemeProvider'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity, href: '/dashboard' },
  { id: 'deployments', label: 'Real-time Deployments', icon: Sparkles, href: '/dashboard/deployments' },
  { id: 'reports', label: 'Vulnerability Reports', icon: FileText, href: '/dashboard/reports' },
  { id: 'attack-surface', label: 'Attack Surface Map', icon: Map, href: '/dashboard/attack-surface' },
  { id: 'ai-triage', label: 'AI Insights / Triage', icon: AlertTriangle, href: '/dashboard/ai-triage' },
  { id: 'projects', label: 'Projects', icon: Code, href: '/dashboard/projects' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function ProjectsPage() {
  const pathname = usePathname()
  const { theme } = useThemePreference()

  return (
    <div
      className={cn(
        'min-h-screen transition-colors',
        theme === 'light' ? 'bg-[#f6f6f7]' : 'bg-deep-navy text-white'
      )}
    >
      <TopNav />
      <div className="flex">
        {/* Light-themed Sidebar */}
        <aside className="hidden md:flex md:flex-col w-60 shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-gray-100 border-r border-gray-200">
          <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
            {items.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.id === 'dashboard' && pathname === '/dashboard')
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                    active
                      ? 'bg-gray-200 text-gray-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{item.label}</span>
                </a>
              )
            })}
          </nav>
          <div className="px-3 py-3 border-t border-gray-200 text-[10px] text-gray-500">
            Monitoring <span className="text-gray-700 font-medium">Ethereum, EVM chains &amp; Solana</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-base text-gray-600">
              Start your project&apos;s security journey effortlessly by linking repositories,
              tracking contract addresses, or uploading your Solidity files.
            </p>
          </div>

          {/* Three-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LinkRepositoryCard />
            <TrackContractCard />
            <UploadFilesCard />
          </div>
        </main>
      </div>
    </div>
  )
}


