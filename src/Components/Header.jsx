import React from 'react'
import { FaPersonRifle } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'
import { IoMdPerson } from "react-icons/io";


const Header = () => {
  return (
    <>
       {/* Top Section */}
       <div className="w-full flex justify-center items-center py-4 px-6 ">
        {/* <button className="text-gray-400  text-lg">Cancel</button> */}
        <h1 className="font-bold text-xl">BountyTap</h1>
       <div className='absolute right-6'> <NavLink to={'/profile'} >       <IoMdPerson className='text-2xl' /></NavLink></div>
      </div>
    </>
  )
}

export default Header
