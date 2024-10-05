import React, { useState, useEffect } from 'react';
import { IoMdTime } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";
import { FaShare } from "react-icons/fa";

const TaskItem = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const imageUrl = `${process.env.REACT_APP_APPWRITE_URL}/storage/buckets/${process.env.REACT_APP_APPWRITE_BUCKET_ID}/files/${data.image}/preview?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    // Calculate end time based on created at time and duration
    useEffect(() => {
        const createdAt = new Date(data.$createdAt).getTime(); // Parse the ISO 8601 timestamp
        const durationInMilliseconds = data.taskDuration * 3600 * 1000; // Convert hours to milliseconds
        const endTime = createdAt + durationInMilliseconds;

        const updateTimer = () => {
            const currentTime = new Date().getTime();
            const remainingTime = endTime - currentTime;

            if (remainingTime <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
            } else {
                setTimeLeft(Math.floor(remainingTime / 1000)); // Convert milliseconds to seconds
            }
        };

        updateTimer(); // Initialize the timer
        const timer = setInterval(updateTimer, 1000); // Update every second

        return () => clearInterval(timer); // Clear the timer on unmount
    }, [data.createdAt, data.taskDuration]);

    // Format seconds to hh:mm:ss
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="border border-gray-400 rounded-md relative">
            {/* Collapse Icon */}
            <FiChevronDown
                className={`text-2xl text-black font-bold absolute top-2 right-2 cursor-pointer transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                onClick={toggleOpen}
            />

            {/* Image Placeholder */}
            <div className="flex items-center space-x-4">
                <img src={imageUrl} alt={data.companyName} className="h-24 object-cover w-full" />
            </div>

            {/* Time Left */}
            <div className="flex items-center text-xs w-full px-4 py-2 justify-between">
                {/* Task Title */}
                <h2 className="text-sm font-semibold">{data.companyName}</h2>

                <p className='flex items-center'>
                    <IoMdTime className="mr-1" />
                    {formatTime(timeLeft)}
                </p>
            </div>

            {/* Collapsible Content */}
            <div
                className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-50' : 'max-h-0'}`}
            >
                {/* Content that will be shown/hidden */}
                <div className="p-4 flex flex-col gap-4">
                    <div className='flex w-full justify-between items-center'>
                        <p>Follow On X</p>
                        <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">Claim 100 Bounty</button>
                    </div>
                    <div className='flex w-full justify-between items-center'>
                        <p>Telegram chat</p>
                        <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">Claim 100 Bounty</button>
                    </div>
                    <div className='flex w-full justify-between items-center'>
                        <p>Telegram Ann</p>
                        <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">Claim 100 Bounty</button>
                    </div>
                    <div className='flex w-full justify-between items-center'>
                        <input type="text" required placeholder='Enter your BEP-20 address' className='rounded-lg bg-gray-900 px-4 py-2 text-xs' />
                        <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">Submit</button>
                    </div>

                    <div className='w-full flex justify-center items-center gap-2 py-2 text-sm rounded-lg border-[.5px]'>
                        <p>Share and get Referral bonus</p> <FaShare />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
