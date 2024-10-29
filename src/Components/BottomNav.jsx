import React from 'react'
import { RiHome4Fill } from "react-icons/ri";
import { IoMdCheckboxOutline } from "react-icons/io";
import { IoIosRocket } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-black rounded-xl text-white py-4">
            <div className="flex justify-around">
                {/* Home */}
                <NavLink 
                    to={'/'} 
                    className={({ isActive }) => 
                        `flex flex-col items-center ${isActive ? 'text-yellow-500' : ''}`}
                >
                    <RiHome4Fill className='text-2xl' />
                    <span className="text-xs mt-1">Home</span>
                </NavLink>

                {/* Tasks */}
                <NavLink 
                    to={'/tasks'} 
                    className={({ isActive }) => 
                        `flex flex-col items-center ${isActive ? 'text-yellow-500' : ''}`}
                >
                    <IoMdCheckboxOutline className='text-2xl' />
                    <span className="text-xs mt-1">Tasks</span>
                </NavLink>

                {/* Boost */}
                <NavLink 
                    to={'/boost'} 
                    className={({ isActive }) => 
                        `flex flex-col items-center ${isActive ? 'text-yellow-500' : ''}`}
                >
                    <IoIosRocket className='text-2xl' />
                    <span className="text-xs mt-1">Boost</span>
                </NavLink>

                {/* Invite */}
                <NavLink 
                    to={'/referral'} 
                    className={({ isActive }) => 
                        `flex flex-col items-center ${isActive ? 'text-yellow-500' : ''}`}
                >
                    <IoMdPerson className='text-2xl' />
                    <span className="text-xs mt-1">Invite</span>
                </NavLink>
            </div>
        </div>
    )
}

export default BottomNav;
