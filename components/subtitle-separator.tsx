

import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

export const SubtitleSeparator = ({text, className, children} : {children?: ReactNode, text: string, className?: string }) => {
  return (
    <div className={cn('w-full h-12 bg-secondary text-white flex items-center justify-between pl-3', className, children && "px-3")}>
        <h4 className='text-sm font-normal uppercase'>{text}</h4>
        <div>
          {children}
        </div>
    </div>
  )
}
