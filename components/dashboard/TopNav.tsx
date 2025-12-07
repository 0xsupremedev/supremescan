'use client'

import { Fragment } from 'react'
import { Menu, Bell, Search, ChevronDown, Moon, Sun } from 'lucide-react'
import { Dialog, Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useThemePreference } from '@/components/ThemeProvider'
import BrandMark from '@/components/BrandMark'
import ConnectWalletButton from '@/components/ConnectWalletButton'

const suggestions = [
  '0xAb5c...9F12',
  '0x9f3A...cD21',
  'Audit-ETH-2024-001',
  'UniswapV3Core',
]

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { theme, toggleTheme } = useThemePreference()

  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <header className="glass border-b border-white/10 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Left: Logo */}
        <Link href="/dashboard">
          <BrandMark className="cursor-pointer" />
        </Link>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 items-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/60"
              placeholder="Search by contract, tx hash, or audit ID..."
            />
            {filtered.length > 0 && (
              <div className="absolute mt-1 w-full rounded-lg bg-deep-navy border border-white/10 shadow-xl overflow-hidden">
                {filtered.map((s) => (
                  <button
                    key={s}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Mobile search toggle */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
            onClick={() => setMobileOpen(true)}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
            </HeadlessMenu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-deep-navy border border-white/10 shadow-2xl focus:outline-none">
                <div className="px-3 py-2 border-b border-white/10 text-xs text-gray-400">
                  Real-time alerts
                </div>
                <div className="max-h-64 overflow-y-auto text-xs">
                  <div className="px-3 py-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
                      <div>
                        <p className="text-gray-200">
                          Critical vulnerability detected in <span className="font-semibold">CoreVault</span>
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">Reentrancy in withdraw() · 2m ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <div>
                        <p className="text-gray-200">
                          New deployment monitored on <span className="font-semibold">Polygon</span>
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">Scanner attached · 15m ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>

          {/* User menu */}
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-2 py-1 text-xs text-gray-200 hover:bg-white/10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-semibold">
                AS
              </div>
              <span className="hidden sm:inline">ashutosh</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </HeadlessMenu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-deep-navy border border-white/10 shadow-2xl text-xs text-gray-200 focus:outline-none">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="font-semibold">ashutosh</p>
                  <p className="text-[10px] text-gray-500">Security Engineer</p>
                </div>
                <div className="py-1">
                  {[
                    'Account Settings',
                    'API Keys',
                    'Security Logs',
                    'Billing',
                    'Sign Out',
                  ].map((item) => (
                    <HeadlessMenu.Item key={item}>
                      {({ active }) => (
                        <button
                          className={cn(
                            'w-full text-left px-3 py-1.5 text-[11px]',
                            active && 'bg-white/5 text-white'
                          )}
                        >
                          {item}
                        </button>
                      )}
                    </HeadlessMenu.Item>
                  ))}
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>

          {/* Theme toggle */}
          <button
            aria-label="Toggle color theme"
            className={cn(
              'p-2 rounded-lg transition-colors border',
              theme === 'light'
                ? 'bg-white border-gray-200 text-slate-600 hover:bg-slate-100'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            )}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <ConnectWalletButton />

          {/* Mobile menu icon placeholder (if needed) */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile search/dialog */}
      <Transition.Root show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setMobileOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex items-start justify-center mt-16 px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <Dialog.Panel className="w-full max-w-lg rounded-xl bg-deep-navy border border-white/10 p-4 shadow-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/60"
                    placeholder="Search by contract, tx hash, or audit ID..."
                  />
                </div>
                {filtered.length > 0 && (
                  <div className="mt-3 rounded-lg bg-deep-navy/80 border border-white/10 max-h-48 overflow-y-auto">
                    {filtered.map((s) => (
                      <button
                        key={s}
                        className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
                        onClick={() => setMobileOpen(false)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  )
}


