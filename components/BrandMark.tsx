'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import logoIcon from '@/logos/logo icon.png'

interface BrandMarkProps {
  withText?: boolean
  textClassName?: string
  iconClassName?: string
  className?: string
}

export default function BrandMark({
  withText = true,
  textClassName,
  iconClassName,
  className,
}: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 select-none', className)}>
      <span
        className={cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-[#020617]/40',
          iconClassName
        )}
      >
        <Image
          src={logoIcon}
          alt="SupremeScan logo"
          fill
          sizes="36px"
          className="object-contain"
          priority
        />
      </span>
      {withText && (
        <span
          className={cn(
            'text-lg font-semibold tracking-tight bg-gradient-to-r from-[#d7e8ff] via-[#9dd4ff] to-[#7de0ff] bg-clip-text text-transparent',
            textClassName
          )}
        >
          SupremeScan
        </span>
      )}
    </span>
  )
}

