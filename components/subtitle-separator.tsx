

import React from 'react'

export const SubtitleSeparator = ({text} : { text: string }) => {
  return (
    <div className='w-full h-12 bg-slate-800 text-white flex items-center pl-3'>
        <h4 className='text-sm font-normal uppercase'>{text}</h4>
    </div>
  )
}
