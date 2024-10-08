import React, { useState, useEffect } from 'react';
import { IoMdTime } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TaskItem = ({ data }) => {
    const { userInfo } = useSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const [claimButtonsState, setClaimButtonsState] = useState({
        X: { claimed: false, goClicked: false },
        telegramChat: { claimed: false, goClicked: false },
        telegramAnn: { claimed: false, goClicked: false },
        instagram: { claimed: false, goClicked: false },
        youtube: { claimed: false, goClicked: false },
        discord: { claimed: false, goClicked: false },
        website: { claimed: false, goClicked: false }
    });

    const [hasJoinedChat, setHasJoinedChat] = useState(false);
    const [hasJoinedAnn, setHasJoinedAnn] = useState(false);

    const imageUrl = `${process.env.REACT_APP_APPWRITE_URL}/storage/buckets/${process.env.REACT_APP_APPWRITE_BUCKET_ID}/files/${data.image}/preview?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const createdAt = new Date(data.$createdAt).getTime();
        const durationInMilliseconds = data.taskDuration * 3600 * 1000;
        const endTime = createdAt + durationInMilliseconds;

        let timer;

        const updateTimer = () => {
            const currentTime = new Date().getTime();
            const remainingTime = endTime - currentTime;

            if (remainingTime <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
            } else {
                setTimeLeft(Math.floor(remainingTime / 1000));
            }
        };

        updateTimer();
        timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [data.$createdAt, data.taskDuration]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleGoClick = (key) => {
        if (key === 'X') {
            window.open(data.twitter, '_blank');
        } else if (key === 'instagram') {
            window.open(data.instagram, '_blank');
        } else if (key === 'youtube') {
            window.open(data.youtube, '_blank');
        } else if (key === 'discord') {
            window.open(data.discord, '_blank');
        } else if (key === 'website') {
            window.open(data.website, '_blank');
        }

        // Enable "Check" button after "Go" is clicked
        setClaimButtonsState((prevState) => ({
            ...prevState,
            [key]: { ...prevState[key], goClicked: true }
        }));
    };

    const handleCheckClick = async (key) => {
        try {
            console.log(key)
            if(!claimButtonsState[key].goClicked){
                if(key==='website') toast.error('Please visit the website')
               else toast.error(`Please follow on the ${key} page`)
            }
            else{
                setClaimButtonsState((prevState) => ({
                    ...prevState,
                    [key]: { ...prevState[key], claimed: true }
                }));
            }
        } catch (error) {
            console.error('Error checking task:', error);
            toast.error("An error occurred while checking your task.")
        }
    };

    const handleTelegramCheckClick = async (key) => {
        const botToken = process.env.REACT_APP_BOT_TOKEN;
        // const userId = 1337182007;
        // const userId = 1751474467;
        const userId = userInfo.id;
        const chatIdGroup = data.telegramChatID;
        const chatIdAnn = data.telegramAnnID;

        const checkTelegramMembership = async (chatId) => {
            const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=-100${chatId}&user_id=${userId}`;
            const response = await axios.get(url);
            return response.data.result.status === 'member' ||
                response.data.result.status === 'administrator' ||
                response.data.result.status === 'creator';
        };

        try {
            if (key === 'telegramChat') {
                const hasJoined = await checkTelegramMembership(chatIdGroup);
                if (hasJoined) {
                    setHasJoinedChat(true);
                } else {
                    // alert('You have not joined the Telegram group.');
                    toast.warn("You have not joined the Telegram group.")
                }
            } else if (key === 'telegramAnn') {
                const hasJoined = await checkTelegramMembership(chatIdAnn);
                if (hasJoined) {
                    setHasJoinedAnn(true);
                } else {
                    // alert('You have not joined the announcement channel.');
                    toast.warn("You have not joined the announcement channel.")
                }
            }
        } catch (error) {
            console.error('Error checking membership:', error);
            toast.error('An error occurred while checking your membership status.');
        }
    };

    return (
        <div className="border border-gray-400 rounded-md relative">
            <FiChevronDown
                className={`text-2xl font-bold absolute top-2 right-2 cursor-pointer transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                onClick={toggleOpen}
            />

            <div className="flex items-center space-x-4">
                <img src={imageUrl} alt={data.companyName} className="h-24 object-cover w-full" />
            </div>

            <div className="flex items-center text-xs w-full px-4 py-2 justify-between">
                <h2 className="text-sm font-semibold">{data.companyName}</h2>
                <p className='flex items-center'>
                    <IoMdTime className="mr-1" />
                    {formatTime(timeLeft)}
                </p>
            </div>

            <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-50' : 'max-h-0'}`}>
                <div className="p-4 flex flex-col gap-4">
                    {/* Follow on X (Twitter) */}
                    {data.twitter ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Follow On X (Twitter)</p>
                            {claimButtonsState.X.claimed ? (
                                <button className="bg-green-500 px-4 py-2 rounded-lg text-xs font-bold">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        onClick={() => handleGoClick('X')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        // disabled={!claimButtonsState.X.goClicked}
                                        onClick={() => handleCheckClick('X')}
                                    >
                                        Check
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (null)}

                    {/* Telegram Chat */}
                    {data.telegramChatInvite ? (<div className='flex w-full justify-between items-center'>
                        <p>Telegram Chat</p>
                        {hasJoinedChat ? (
                            <button className="bg-green-500 px-4 py-2 rounded-lg text-xs font-bold">
                                Claimed
                            </button>
                        ) : (
                            <div className='flex gap-2'>
                                <button
                                    className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                    onClick={() => window.open(data.telegramChatInvite, '_blank')}
                                >
                                    Go
                                </button>
                                <button
                                    className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                    onClick={() => handleTelegramCheckClick('telegramChat')}
                                >
                                    Check
                                </button>
                            </div>
                        )}
                    </div>
                    ) : (null)}

                    {/* Telegram Announcement */}
                    {data.telegramAnnInvite ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Telegram Announcement</p>
                            {hasJoinedAnn ? (
                                <button className="bg-green-500 px-4 py-2 rounded-lg text-xs font-bold">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        onClick={() => window.open(data.telegramAnnInvite, '_blank')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        onClick={() => handleTelegramCheckClick('telegramAnn')}
                                    >
                                        Check
                                    </button>
                                </div>
                            )}
                        </div>

                    ) : (null)}

                    {/* Instagram */}
                    {data.instagram ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Instagram</p>
                            {claimButtonsState.instagram.claimed ? (
                                <button className="bg-green-500 px-4 py-2 rounded-lg text-xs font-bold">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        onClick={() => handleGoClick('instagram')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        // disabled={!claimButtonsState.instagram.goClicked}
                                        onClick={() => handleCheckClick('instagram')}
                                    >
                                        Check
                                    </button>
                                </div>
                            )}
                        </div>

                    ) : (null)}
                    {/* YouTube */}
                    {data.youtube ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>YouTube</p>
                            {claimButtonsState.youtube.claimed ? (
                                <button className="bg-green-500 px-4 py-2 rounded-lg text-xs font-bold">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        onClick={() => handleGoClick('youtube')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        // disabled={!claimButtonsState.youtube.goClicked}
                                        onClick={() => handleCheckClick('youtube')}
                                    >
                                        Check
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (null)}

                    {/* Discord */}
                    {data.discord ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Discord</p>
                            {claimButtonsState.discord.claimed ? (
                                <button className="bg-green-500 px-4 py-2 rounded-lg text-xs font-bold">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        onClick={() => handleGoClick('discord')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        // disabled={!claimButtonsState.discord.goClicked}
                                        onClick={() => handleCheckClick('discord')}
                                    >
                                        Check
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (null)}

                    {/* Website */}
                    {data.website ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Website</p>
                            {claimButtonsState.website.claimed ? (
                                <button className="bg-green-500 px-4 py-2 rounded-lg text-xs font-bold">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        onClick={() => handleGoClick('website')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold"
                                        // disabled={!claimButtonsState.website.goClicked}
                                        onClick={() => handleCheckClick('website')}
                                    >
                                        Check
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (null)}



                    <div className="flex  items-center  gap-4 rounded-lg shadow-lg justify-between w-full">
                        <input type="text" id="bep20-address" placeholder="Enter Your BEP-20 Address" className="px-4 py-2 w-full text-black bg-gray-700 rounded-md max-w-48 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <button className="bg-gradient-to-r from-black to-[#7d5126] text-white px-6 py-2 rounded-lg hover:bg-purple-600">Submit</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TaskItem;
