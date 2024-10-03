import React from "react";
import { FaInstagram, FaLinkedin, FaLinkedinIn, FaTelegram, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";


const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <div className=" text-white h-[40rem] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">

        <h1 className="text-lg font-bold">Profile</h1>
        {userInfo.id === process.env.REACT_APP_ADMIN_ID? ( <NavLink className='p-6 py-2 text-sm bg-gradient-to-r from-black to-[#b1783e] font-semibold  rounded-lg'>Admin</NavLink>
        ):(null) }
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center ">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center ">
          <span className="text-4xl">👤</span>
        </div>
        {(userInfo.first_name || userInfo.username) ? (
          <div className="w-full flex justify-center px-4 mb-4">
            <h2 className="font-bold">
              Hello, {userInfo.first_name || userInfo.username}!
            </h2>
          </div>
        ) : (null)}
      </div>

      {/* Options Section */}
      <div className="flex flex-col items-center px-4 mt-2 space-y-4">
        {/* Profile */}
        <button className="bg-gray-800 flex justify-between w-full py-4 px-6 rounded-lg">
          <span>Username </span>
          <span className="text-gray-400"> {userInfo.username}</span>
        </button>

        {/* Withdraw */}
        <button className="bg-gray-800 flex justify-between w-full py-4 px-6 rounded-lg">
          <span>UserID</span>
          <span className="text-gray-400"> {userInfo.id}</span>
        </button>


      </div>

      {/* Footer */}
      <div className="px-4 py-4">
        <p className="text-center mb-1 text-gray-400">Stay updated</p>
        <p className="text-center mb-4 text-gray-400">Follow us on social media</p>

        {/* Social Icons */}
        <div className="flex justify-center text-3xl space-x-6 mt-8">
          <button className="text-gray-400"><FaXTwitter className="text-white" /></button>
          <button className="text-gray-400"><FaInstagram className="text-red-500" /></button>
          <button className="text-gray-400"><FaTelegramPlane className="text-blue-400" /></button>
          <button className="text-gray-400"><FaLinkedinIn className="text-blue-400" /></button>
        </div>

        {/* Links */}
        {/* <div className="flex justify-center space-x-6 text-gray-400 text-sm">
          <a href="#">Roadmap</a>
          <a href="#">Privacy policy</a>
          <a href="#">FAQ</a>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
