'use client'

interface ScanIntensitySliderProps {
  value: number // 0-100
  onChange: (value: number) => void
}

export default function ScanIntensitySlider({ value, onChange }: ScanIntensitySliderProps) {
  const getLabel = (val: number) => {
    if (val <= 33) return 'Fast (Shallow)'
    if (val <= 66) return 'Medium'
    return 'Deep (Thorough)'
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #374151 ${value}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Fast (Shallow)</span>
          <span>Medium</span>
          <span>Deep (Thorough)</span>
        </div>
      </div>
      <div className="text-sm text-gray-300">
        Current: <span className="font-semibold text-blue-400">{getLabel(value)}</span>
      </div>
    </div>
  )
}

