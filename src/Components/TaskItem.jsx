import React, { useState, useEffect } from 'react';
import { IoMdTime } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaShare } from 'react-icons/fa6';
import service from '../appwrite/database';
import { VscGlobe } from 'react-icons/vsc';

const TaskItem = ({ data }) => {
    const { userInfo } = useSelector((state) => state.user);

    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [tasksCnt, setTasksCnt] = useState(0)

    const botToken = process.env.REACT_APP_BOT_TOKEN;
    // const userId = 1337182007
    // const userId = 1751474467;
    const userId = userInfo?.id ;

    const chatIdGroup = data.telegramChatID;
    const chatIdAnn = data.telegramAnnID;

    const [claimButtonsState, setClaimButtonsState] = useState({
        X: { claim: true, claimed: false, goClicked: false, link: data.twitter },
        telegramChat: { claim: true, claimed: false, goClicked: false, link: data.telegramChatInvite },
        telegramAnn: { claim: true, claimed: false, goClicked: false, link: data.telegramAnnInvite },
        instagram: { claim: true, claimed: false, goClicked: false, link: data.instagram },
        youtube: { claim: true, claimed: false, goClicked: false, link: data.youtube },
        discord: { claim: true, claimed: false, goClicked: false, link: data.discord },
        website: { claim: true, claimed: false, goClicked: false, link: data.website }
    });

    const [hasJoinedChat, setHasJoinedChat] = useState(false);
    const [hasJoinedAnn, setHasJoinedAnn] = useState(false);
    const [allTasksCompleted, setAllTasksCompleted] = useState(false);


    const fetchUserData = async () => {
        try {

            // Fetch user data from the service
            const userData = await service.getUser(userId);
            // console.log("User Data:", userData);

            const userTasks = userData.tasks;
            const taskId = data.$id;

            // Find if the task exists in the user's tasks
            const findTask = userTasks.find(id => id === taskId);
            // console.log("Found Task:", findTask);

            if (findTask) {
                setAllTasksCompleted(true);
                setHasJoinedChat(true);
                setHasJoinedAnn(true)
                // console.log(`Task ${taskId} is completed by the user.`);

                setClaimButtonsState(prevState => {
                    const updatedState = { ...prevState };

                    // Iterate over each task in claimButtonsState
                    Object.keys(updatedState).forEach(key => {

                        updatedState[key].claim = false;
                        updatedState[key].claimed = true;

                    });

                    return updatedState;
                });
            } else {
                console.log(`Task ${taskId} is not completed by the user.`);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    useEffect(() => {
        fetchUserData()
    }, [])


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


    const handleClaimClick = (key) => {
        setClaimButtonsState((prevState) => ({
            ...prevState,
            [key]: { ...prevState[key], claim: false }  // Toggle the claim state
        }));
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
            if (!claimButtonsState[key].goClicked) {
                if (key === 'website') toast.error('Please visit the website')
                else toast.error(`Please follow on the ${key} page`)
            }
            else {
                setClaimButtonsState((prevState) => ({
                    ...prevState,
                    [key]: { ...prevState[key], claimed: true }
                }));
                setTasksCnt(tasksCnt + 1)
            }
        } catch (error) {
            console.error('Error checking task:', error);
            toast.error("An error occurred while checking your task.")
        }
    };

    const handleTelegramCheckClick = async (key) => {


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
                    setTasksCnt(tasksCnt + 1)
                    setClaimButtonsState((prevState) => ({
                        ...prevState,
                        [key]: { ...prevState[key], claimed: true }
                    }));
                } else {
                    // alert('You have not joined the Telegram group.');
                    toast.warn("You have not joined the Telegram group.")
                }
            } else if (key === 'telegramAnn') {
                const hasJoined = await checkTelegramMembership(chatIdAnn);
                if (hasJoined) {
                    setHasJoinedAnn(true);
                    setTasksCnt(tasksCnt + 1)
                    setClaimButtonsState((prevState) => ({
                        ...prevState,
                        [key]: { ...prevState[key], claimed: true }
                    }));
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
    const checkAllTasksCompleted = () => {
        const allCompleted = Object.entries(claimButtonsState)
            .filter(([key, value]) => {
                // Check if link exists
                const linkExists = value.link !== undefined && value.link !== null && value.link !== '';
                return linkExists; // Only keep tasks with existing links
            })
            .every(([key, value]) => {
                // Check if the task is claimed
                return value.claimed;
            });

        return allCompleted; // Return the completion status
    };

    const handleSubmit = async (e) => {
       
        e.preventDefault()
        const bep20Address = e.target.elements['bep20-address'].value;

        const allTasksCompleted = checkAllTasksCompleted(); // Check if all tasks are completed

        if (allTasksCompleted && bep20Address) {

            console.log(userId, data.$id)
            await service.updateUserTasks(userId.toString(), data.$id);
            await service.updateUserCoins(userId, tasksCnt * 100)

            const newUserData = {
                userId,
                bep20Address,
            }
            await service.updateCompanyUsers(data.$id, newUserData)

            setAllTasksCompleted(allTasksCompleted); // Update the state if necessary
            toast.success("All tasks completed");
        } else {

            toast.error("Please complete all tasks!");
        }


    };




    const handleShare = () => {
        console.log(data);
    
        const message = `🏆 Earn exclusive bounties and collect coins! 💰 Stay updated with all the latest news and announcements. 🚀 Follow our official Telegram announcement channel for special rewards, important notifications, and more:\n\nJoin the Channel.\n\nDon’t miss out on the treasure!`;
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.telegramAnnInvite)}&text=${encodeURIComponent(message)} `;
    
        // Open Telegram app or web version
        window.open(telegramUrl, '_blank');
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
                            {claimButtonsState.X.claim ? (
                                <button onClick={() => handleClaimClick('X')} className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
                                    Claim 100 bounty
                                </button>
                            ) : (

                                claimButtonsState.X.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
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

                                            onClick={() => handleCheckClick('X')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}

                        </div>
                    ) : (null)}

                    {/* Telegram Chat */}
                    {data.telegramChatInvite ? (<div className='flex w-full justify-between items-center'>
                        <p>Telegram Chat</p>
                        {claimButtonsState.telegramChat.claim ? (
                            <button onClick={() => handleClaimClick('telegramChat')} className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
                                Claim 100 bounty
                            </button>
                        ) : (
                            hasJoinedChat ? (
                                <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
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
                            )
                        )}
                    </div>
                    ) : (null)}

                    {/* Telegram Announcement */}
                    {data.telegramAnnInvite ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Telegram Announcement</p>
                            {claimButtonsState.telegramAnn.claim ? (
                                <button onClick={() => handleClaimClick('telegramAnn')} className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
                                    Claim 100 bounty
                                </button>
                            ) : (
                                hasJoinedAnn ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
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
                                )
                            )}
                        </div>

                    ) : (null)}

                    {/* Instagram */}
                    {data.instagram ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Instagram</p>
                            {claimButtonsState.instagram.claim ? (
                                <button onClick={() => handleClaimClick('instagram')} className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
                                    Claim 100 bounty
                                </button>
                            ) : (
                                claimButtonsState.instagram.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
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
                                            onClick={() => handleCheckClick('instagram')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}
                    {/* YouTube */}
                    {data.youtube ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>YouTube</p>
                            {claimButtonsState.youtube.claim ? (
                                <button onClick={() => handleClaimClick('youtube')} className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
                                    Claim 100 bounty
                                </button>
                            ) : (
                                claimButtonsState.youtube.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
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
                                            onClick={() => handleCheckClick('youtube')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}

                    {/* Discord */}
                    {data.discord ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Discord</p>
                            {claimButtonsState.discord.claim ? (
                                <button onClick={() => handleClaimClick('discord')} className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
                                    Claim 100 bounty
                                </button>
                            ) : (
                                claimButtonsState.discord.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
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

                                            onClick={() => handleCheckClick('discord')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}

                    {/* Website */}
                    {data.website ? (
                        <div className='flex w-full justify-between items-center'>
                            <p>Website</p>
                            {claimButtonsState.website.claim ? (
                                <button onClick={() => handleClaimClick('website')} className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
                                    Claim 100 bounty
                                </button>
                            ) : (
                                claimButtonsState.website.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-4 py-2 rounded-lg text-xs font-bold">
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
                                            onClick={() => handleCheckClick('website')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}


                    {!allTasksCompleted ? (
                        <form
                            className="flex items-center gap-4 rounded-lg shadow-lg justify-between w-full"
                            onSubmit={handleSubmit} // Attach the submit handler to the form
                        >
                            <input
                                type="text"
                                id="bep20-address"
                                placeholder="Enter Your BEP-20 Address"
                                className="px-4 py-2 w-full text-white bg-gray-700 rounded-md max-w-48 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type='submit' // Ensure the button submits the form
                                className="bg-gradient-to-r from-black to-[#7d5126] text-white px-6 py-2 rounded-lg hover:bg-purple-600"
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        <div
                            className="flex items-center gap-4 rounded-lg shadow-lg justify-end w-full"

                        >

                            <button

                                className="bg-gradient-to-r from-black to-[#7d5126] text-white px-6 py-2 rounded-lg hover:bg-purple-600"
                            >
                                Wallet address submitted
                            </button>
                        </div>
                    )}

                    <button onClick={handleShare} className='flex justify-center items-center  gap-6 border border-[1px]-white rounded-lg py-2'>Share and get referral bonus <FaShare /></button>

                </div>
            </div>
        </div>
    );
};

export default TaskItem;
