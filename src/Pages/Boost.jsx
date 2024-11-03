import React from 'react'
import wallet from '../images/wallet.png'

const Boost = () => {
  return (
    <div>
        <div className='flex flex-col min-h-[40rem] justify-center gap-8 items-center '>
            <img className='h-72' src={wallet } alt="comingsoon" />

            <h2 className='text-3xl font-bold'>Coming soon...</h2>
        </div>
    </div>
  )
}

export default Boost


