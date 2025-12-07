'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Wallet2, Copy, Check, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemePreference } from '@/components/ThemeProvider'

function generateMockAddress() {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}`
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

interface ConnectWalletButtonProps {
  className?: string
}

export default function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const [address, setAddress] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { theme } = useThemePreference()

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await new Promise((resolve) => setTimeout(resolve, 900))
      setAddress(generateMockAddress())
    } finally {
      setIsConnecting(false)
    }
  }

  const handleCopy = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 1500)
  }

  if (!address) {
    return (
      <button
        className={cn(
          'inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70',
          className
        )}
        onClick={handleConnect}
        disabled={isConnecting}
      >
        <Wallet2 className="h-4 w-4" />
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
          theme === 'light'
            ? 'border border-gray-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100'
            : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
        )}
      >
        <Wallet2 className="h-4 w-4" />
        {truncateAddress(address)}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute right-0 mt-2 w-48 origin-top-right rounded-xl border p-1 text-xs shadow-2xl focus:outline-none',
            theme === 'light'
              ? 'border-gray-200 bg-white text-slate-700'
              : 'border-white/10 bg-deep-navy text-gray-200'
          )}
        >
          <div className={cn('px-3 py-2 text-[11px]', theme === 'light' ? 'text-slate-500' : 'text-gray-400')}>
            Connected Wallet
          </div>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleCopy}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition',
                  active && (theme === 'light' ? 'bg-slate-100' : 'bg-white/5')
                )}
              >
                {copySuccess ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copySuccess ? 'Copied!' : 'Copy Address'}
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setAddress(null)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 transition hover:text-red-300',
                  active && (theme === 'light' ? 'bg-red-50' : 'bg-red-500/10')
                )}
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

