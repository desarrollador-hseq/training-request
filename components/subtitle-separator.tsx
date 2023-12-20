

import { cn } from '@/lib/utils'
import React from 'react'

export const SubtitleSeparator = ({text, className} : { text: string, className?: string }) => {
  return (
    <div className={cn('w-full h-12 bg-secondary text-white flex items-center pl-3', className)}>
        <h4 className='text-sm font-normal uppercase'>{text}</h4>
    </div>
  )
}
