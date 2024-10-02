import React from 'react'
import comingsoon from '../images/comingsoon.png'

const Boost = () => {
  return (
    <div>
        <div className='flex flex-col min-h-[40rem] justify-center gap-8 items-center '>
            <img src={comingsoon } alt="comingsoon" />

            <h2 className='text-3xl font-bold'>Coming soon...</h2>
        </div>
    </div>
  )
}

export default Boost


