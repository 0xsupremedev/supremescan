'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChainOption } from '@/lib/types/dashboard'

interface MultiSelectChipsProps {
  selected: ChainOption[]
  available: ChainOption[]
  onChange: (selected: ChainOption[]) => void
  placeholder?: string
}

export default function MultiSelectChips({
  selected,
  available,
  onChange,
  placeholder = 'Select chains...',
}: MultiSelectChipsProps) {
  const removeChain = (chain: ChainOption) => {
    onChange(selected.filter((c) => c !== chain))
  }

  const addChain = (chain: ChainOption) => {
    if (!selected.includes(chain)) {
      onChange([...selected, chain])
    }
  }

  const unselected = available.filter((c) => !selected.includes(c))

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 rounded-lg bg-white/5 border border-white/10">
        {selected.length > 0 ? (
          selected.map((chain) => (
            <div
              key={chain}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-700/50 text-sm text-gray-200"
            >
              <span>{chain}</span>
              <button
                onClick={() => removeChain(chain)}
                className="ml-0.5 hover:text-white transition-colors"
                aria-label={`Remove ${chain}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </div>
      {unselected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unselected.map((chain) => (
            <button
              key={chain}
              onClick={() => addChain(chain)}
              className="px-3 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              + {chain}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

