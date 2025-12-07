'use client'

import { cn } from '@/lib/utils'
import { Activity, AlertTriangle, Code, FileText, Map, Settings, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useThemePreference } from '@/components/ThemeProvider'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity, href: '/dashboard' },
  { id: 'deployments', label: 'Real-time Deployments', icon: Sparkles, href: '/dashboard/deployments' },
  { id: 'reports', label: 'Vulnerability Reports', icon: FileText, href: '/dashboard/reports' },
  { id: 'attack-surface', label: 'Attack Surface Map', icon: Map, href: '/dashboard/attack-surface' },
  { id: 'ai-triage', label: 'AI Insights / Triage', icon: AlertTriangle, href: '/dashboard/ai-triage' },
  { id: 'code-repo-integration', label: 'Projects', icon: Code, href: '/dashboard/projects' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { theme } = useThemePreference()

  return (
    <aside
      className={cn(
        'hidden md:flex md:flex-col w-60 shrink-0 h-[calc(100vh-4rem)] sticky top-16 transition-colors',
        theme === 'light'
          ? 'bg-white border-r border-gray-200 text-slate-700 shadow-sm'
          : 'glass border-r border-white/10 text-gray-300'
      )}
    >
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
                  ? 'bg-gradient-to-r from-purple-600/70 to-blue-600/70 text-white shadow-lg shadow-purple-500/40'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          )
        })}
      </nav>
      <div
        className={cn(
          'px-3 py-3 border-t text-[10px]',
          theme === 'light' ? 'border-gray-200 text-slate-500' : 'border-white/10 text-gray-400'
        )}
      >
        Monitoring{' '}
        <span className={cn(theme === 'light' ? 'text-slate-700 font-medium' : 'text-gray-200 font-medium')}>
          Ethereum, EVM chains &amp; Solana
        </span>
      </div>
    </aside>
  )
}
