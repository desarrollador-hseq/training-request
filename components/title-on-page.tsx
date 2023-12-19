

import React from 'react'

export const TitleOnPage = ({text}: { text: string }) => {
  return (
    <div className='w-full h-20 flex items-center'>
      <div className="w-full flex flex-col ">
        <h2 className='text-2xl font-semibold'>{text}</h2>
      </div>

    </div>
  )
}
