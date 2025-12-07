'use client'

import { useState } from 'react'
import type { ContractTracking } from '@/lib/types/dashboard'
import type { ChainOption } from '@/lib/types/dashboard'

const chains: ChainOption[] = ['Ethereum', 'Solana', 'Polygon', 'BSC', 'Avalanche', 'Arbitrum', 'Optimism']

export default function TrackContractCard() {
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState<ChainOption>('Ethereum')

  const handleTrack = () => {
    if (!address.trim()) {
      alert('Please enter a contract address')
      return
    }
    const tracking: ContractTracking = {
      address: address.trim(),
      chain,
    }
    console.log('Tracking contract:', tracking)
    // In a real app, this would initiate scanning pipeline
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Project</h3>
        <h4 className="text-base font-medium text-gray-700">Track Contract Address</h4>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        Monitor deployed contracts on any supported chain.
      </p>

      {/* Contract Address Input */}
      <div className="mb-4">
        <label htmlFor="contract-address" className="block text-sm font-medium text-gray-700 mb-2">
          Contract Address
        </label>
        <input
          id="contract-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Chain Selector */}
      <div className="mb-4">
        <label htmlFor="chain-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Chain
        </label>
        <select
          id="chain-select"
          value={chain}
          onChange={(e) => setChain(e.target.value as ChainOption)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {chains.map((chainOption) => (
            <option key={chainOption} value={chainOption}>
              {chainOption}
            </option>
          ))}
        </select>
      </div>

      {/* Track Button */}
      <button
        onClick={handleTrack}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors mt-auto"
      >
        Track
      </button>
    </div>
  )
}

