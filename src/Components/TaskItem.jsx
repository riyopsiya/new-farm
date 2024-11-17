import React, { useState, useEffect } from 'react';
import { IoMdTime } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaShare } from 'react-icons/fa6';
import service from '../appwrite/database';
import { FaRegCopy } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";



const TaskItem = ({ data, isOpen, onToggle }) => {
    const { userInfo, userData } = useSelector((state) => state.user);   //userInfo is telegram details of the user and userData is the data of user from appwrite
    const [walletAddress, setWalletAddress] = useState("");
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [tasksCnt, setTasksCnt] = useState(0)

    const botToken = process.env.REACT_APP_BOT_TOKEN;

    const userId = userInfo?.id;
   

    const chatIdGroup = data.telegramChatID;
    const chatIdAnn = data.telegramAnnID;

    const [claimButtonsState, setClaimButtonsState] = useState({
        X: { claim: true, claimed: false, goClicked: false, link: data.twitter },
        telegramChat: { claim: true, claimed: false, goClicked: false, link: data.telegramChatInvite },
        telegramAnn: { claim: true, claimed: false, goClicked: false, link: data.telegramAnnInvite },
        instagram: { claim: true, claimed: false, goClicked: false, link: data.instagram },
        facebook: { claim: true, claimed: false, goClicked: false, link: data.facebook },
        youtube: { claim: true, claimed: false, goClicked: false, link: data.youtube },
        discord: { claim: true, claimed: false, goClicked: false, link: data.discord },
        medium: { claim: true, claimed: false, goClicked: false, link: data.medium },
        website: { claim: true, claimed: false, goClicked: false, link: data.website },

        companyTwitter: { claim: true, claimed: false, goClicked: false, link: data.companyTwitter },
        postLink: { claim: true, claimed: false, goClicked: false, link: data.postLink },
        commentPostLink: { claim: true, claimed: false, goClicked: false, link: data.commentPostLink },
        appLink: { claim: true, claimed: false, goClicked: false, link: data.appLink },
        taskLink: { claim: true, claimed: false, goClicked: false, link: data.taskLink },
        campaignLink: { claim: true, claimed: false, goClicked: false, link: data.campaignLink },
        registerLink: { claim: true, claimed: false, goClicked: false, link: data.registerLink },
        companyTelegramChatInvite: { claim: true, claimed: false, goClicked: false, link: data.companyTelegramChatInvite },
        companyTelegramAnnInvite: { claim: true, claimed: false, goClicked: false, link: data.companyTelegramAnnInvite },
        companyFacebook: { claim: true, claimed: false, goClicked: false, link: data.companyFacebook },
        companyInstagram: { claim: true, claimed: false, goClicked: false, link: data.companyInstagram },
        companyLinkedin: { claim: true, claimed: false, goClicked: false, link: data.companyLinkedin },
        companyYoutube: { claim: true, claimed: false, goClicked: false, link: data.companyYoutube },
        companyDiscord: { claim: true, claimed: false, goClicked: false, link: data.companyDiscord },
        companyMedium: { claim: true, claimed: false, goClicked: false, link: data.companyMedium },
        companyWebsite: { claim: true, claimed: false, goClicked: false, link: data.companyWebsite },

    });


    const [hasJoinedChat, setHasJoinedChat] = useState(false);
    const [hasJoinedAnn, setHasJoinedAnn] = useState(false);
    const [allTasksCompleted, setAllTasksCompleted] = useState(false);


    const fetchUserData = async () => {
        try {
            // Fetch user data from the service
            const user = await service.getUser(userId);

            const userTasks = user.tasks;
            const taskId = data?.$id;

            // Find if the task exists in the user's tasks
            const findTask = userTasks?.find(id => id === taskId);


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
        } else if (key === 'facebook') {
            window.open(data.faceook, '_blank');
        } else if (key === 'medium') {
            window.open(data.medium, '_blank');
        } else if (key === 'companyTwitter') {
            window.open(data.companyTwitter, '_blank');
        } else if (key === 'companyTelegramChatInvite') {
            window.open(data.companyTelegramChatInvite, '_blank');
        } else if (key === 'companyTelegramAnnInvite') {
            window.open(data.companyTelegramAnnInvite, '_blank');
        } else if (key === 'companyFacebook') {
            window.open(data.companyFacebook, '_blank');
        } else if (key === 'companyInstagram') {
            window.open(data.companyInstagram, '_blank');
        } else if (key === 'companyLinkedin') {
            window.open(data.companyLinkedin, '_blank');
        } else if (key === 'companyYoutube') {
            window.open(data.companyYoutube, '_blank');
        } else if (key === 'companyDiscord') {
            window.open(data.companyDiscord, '_blank');
        } else if (key === 'companyMedium') {
            window.open(data.companyMedium, '_blank');
        } else if (key === 'companyWebsite') {
            window.open(data.companyWebsite, '_blank');

        } else if (key === 'postLink') {
            window.open(data.postLink, '_blank');
        } else if (key === 'commentPostLink') {
            window.open(data.commentPostLink, '_blank');
        } else if (key === 'appLink') {
            window.open(data.appLink, '_blank');
        } else if (key === 'taskLink') {
            window.open(data.taskLink, '_blank');
        } else if (key === 'campaignLink') {
            window.open(data.campaignLink, '_blank');
        } else if (key === 'registerLink') {
            window.open(data.registerLink, '_blank');
        }




        // // Enable "Check" button after "Go" is clicked

        setClaimButtonsState((prevState) => ({
            ...prevState,
            [key]: { ...prevState[key], goClicked: true }
        }));
    };

    const handleCheckClick = async (key) => {
        try {

            if (!claimButtonsState[key].goClicked) {
                if (key === 'website') toast.error('Please visit the website')
                else toast.error(`Please complete the given task`)
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
        const walletAddress = e.target.elements['walletAddress'].value;

        const allTasksCompleted = checkAllTasksCompleted(); // Check if all tasks are completed


        if (allTasksCompleted && walletAddress) {

            setAllTasksCompleted(allTasksCompleted); // Update the state if necessary


            await service.updateUserTasks(userId.toString(), data.$id);
            await service.updateUserCoins(userId, tasksCnt * 100)

            // const newUserData = {
            //     userId,
            //     walletAddress: walletAddress,
            //     walletType: data?.addressType
            // }

            const newUserData = {
                userId,
                username: userInfo?.username,
                [data?.addressType === "TG username/TON" ? "TG_username_TON" : "walletAddress"]: walletAddress,
                walletType: data?.addressType
            };
            await service.updateCompanyUsers(data.$id, newUserData)
            toast.success("All tasks completed");

        } else {

            toast.error("Please complete all tasks!");
        }


    };




    const referralCode = userData?.referralCode;
    const appInviteLink = "http://t.me/bountytapbot/BountyTap";
    const referralLink = data.referralLink ? `${data.referralLink}` : ` ${appInviteLink}?startapp=${referralCode}`;
    const message = `🎉 BountyTap & ${data.companyName} Campaign 🎉

Join us on BountyTap and earn guaranteed upto 1000 Bounty Tokens and rewards from ${data.companyName} in our collaborative airdrop campaign!

✅ Complete simple tasks, 🔗 share, and start earning today! Don’t miss out – claim your rewards now.

🔗 Referral Link: ${referralLink}

📑 Disclaimer: Airdrop is 100% free. Do not send anything to receive airdrop tokens. Just join the airdrop for free!`;

    const handleShare = () => {

        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(message)} `;

        // Open Telegram app or web version
        window.open(telegramUrl, '_blank');
    };


    const handlecopy = () => {
        navigator.clipboard.writeText(message)
        setCopied(!copied)
        toast.success(" Referral link copied ")
    };
    return (
        <div className="border border-gray-400 rounded-md relative overflow-hidden bg-[#151515] ">
            <FiChevronDown
                className={`text-2xl font-bold absolute top-2 right-2 cursor-pointer transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                onClick={onToggle}
            />

            <div className="flex items-center space-x-4 ">

                <img onClick={onToggle} src={imageUrl} alt={data.companyName} className="h-32 object-cover w-full" />
            </div>

            <div className="flex items-center text-xs w-full px-4 py-2 justify-between">
                <h2 className="text-sm font-semibold">{data.companyName}</h2>


                <p className='flex items-center'>
                    <IoMdTime className="mr-1" />
                    {formatTime(timeLeft)}
                </p>
            </div>

            <div className={`overflow-hidden transition-max-height duration-5000 ease-in-out ${isOpen ? 'max-h-50' : 'max-h-0'}`}>
                <div className="p-4 flex flex-col gap-4  text-sm">


                    {/* Follow on X (Twitter) */}
                    {data.companyTwitter ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow {data.companyName} on X </p>
                            {claimButtonsState.companyTwitter.claim ? (
                                <button onClick={() => handleClaimClick('companyTwitter')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (

                                claimButtonsState.companyTwitter.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyTwitter')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "

                                            onClick={() => handleCheckClick('companyTwitter')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}

                        </div>
                    ) : (null)}

                    {/* Telegram Chat */}
                    {data.companyTelegramChatInvite ? (<div className='flex w-full justify-between items-center'>
                        <p className='max-w-48'>Follow {data.companyName}'s Telegram Group </p>
                        {claimButtonsState.companyTelegramChatInvite.claim ? (
                            <button onClick={() => handleClaimClick('companyTelegramChatInvite')} className="bg-gradient-to-r from-black to-[#7d5126]  px-2 py-2 rounded-lg text-xs font-semibold  ">
                                Claim 100 Bounty
                            </button>
                        ) : (
                            claimButtonsState.companyTelegramChatInvite.claimed ? (
                                <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                        onClick={() => handleGoClick('companyTelegramChatInvite')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                        onClick={() => handleCheckClick('companyTelegramChatInvite')}
                                    >
                                        Check
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                    ) : (null)}

                    {/* Telegram Announcement */}
                    {data.companyTelegramAnnInvite ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow {data.companyName}'s Telegram Channel</p>
                            {claimButtonsState.companyTelegramAnnInvite.claim ? (
                                <button onClick={() => handleClaimClick('companyTelegramAnnInvite')} className="bg-gradient-to-r from-black to-[#7d5126]   px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>

                            ) : (
                                claimButtonsState.companyTelegramAnnInvite.claimed ? (
                                    <button className="bg-gradient-to-r from-black  to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyTelegramAnnInvite')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('companyTelegramAnnInvite')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}


                    {/* app  */}

                    {data.appLink ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Download {data.companyName}'s app</p>
                            {claimButtonsState.appLink.claim ? (
                                <button onClick={() => handleClaimClick('appLink')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.appLink.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('appLink')}
                                        >
                                            Download
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('appLink')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}

                    {/* post  */}

                    {data.postLink ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Like, Retweet and tag 3 friends on the post</p>
                            {claimButtonsState.postLink.claim ? (
                                <button onClick={() => handleClaimClick('postLink')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.postLink.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('postLink')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('postLink')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}

                    {data.commentPostLink ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Like, Retweet and comment on the post</p>
                            {claimButtonsState.commentPostLink.claim ? (
                                <button onClick={() => handleClaimClick('commentPostLink')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.commentPostLink.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('commentPostLink')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('commentPostLink')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}


                    {/* task  */}

                    {data.taskLink ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Complete the task</p>
                            {claimButtonsState.taskLink.claim ? (
                                <button onClick={() => handleClaimClick('taskLink')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.taskLink.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('taskLink')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('taskLink')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}


                    {/* campaign  */}

                    {data.campaignLink ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Participate in campaign</p>
                            {claimButtonsState.campaignLink.claim ? (
                                <button onClick={() => handleClaimClick('campaignLink')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.campaignLink.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('campaignLink')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('campaignLink')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}


                    {/* register  */}

                    {data.registerLink ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Complete the Registration</p>
                            {claimButtonsState.registerLink.claim ? (
                                <button onClick={() => handleClaimClick('registerLink')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.registerLink.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('registerLink')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('registerLink')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}


                    {/* Instagram */}
                    {data.companyInstagram ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow {data.companyName} on Instagram</p>
                            {claimButtonsState.companyInstagram.claim ? (
                                <button onClick={() => handleClaimClick('companyInstagram')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.companyInstagram.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyInstagram')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('companyInstagram')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}

                    {/* LinkedIn */}
                    {data.companyLinkedin ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow {data.companyName} on LinkedIn</p>
                            {claimButtonsState.companyLinkedin.claim ? (
                                <button onClick={() => handleClaimClick('companyLinkedin')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.companyLinkedin.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyLinkedin')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('companyLinkedin')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}

                    {/* facebook */}
                    {data.companyFacebook ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow {data.companyName} on Facebook</p>
                            {claimButtonsState.companyFacebook.claim ? (
                                <button onClick={() => handleClaimClick('companyFacebook')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.companyFacebook.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyFacebook')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('companyFacebook')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}


                    {/* YouTube */}
                    {data.companyYoutube ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Subscribe {data.companyName} on YouTube</p>
                            {claimButtonsState.companyYoutube.claim ? (
                                <button onClick={() => handleClaimClick('companyYoutube')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.companyYoutube.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyYoutube')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('companyYoutube')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}

                    {/* Discord */}
                    {data.companyDiscord ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow {data.companyName} on Discord</p>
                            {claimButtonsState.companyDiscord.claim ? (
                                <button onClick={() => handleClaimClick('companyDiscord')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.companyDiscord.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyDiscord')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "

                                            onClick={() => handleCheckClick('companyDiscord')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}

                    {/* medium */}
                    {data.companyMedium ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow {data.companyName} on Medium</p>
                            {claimButtonsState.companyMedium.claim ? (
                                <button onClick={() => handleClaimClick('companyMedium')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.companyMedium.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyMedium')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('companyMedium')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}

                    {/* Website */}
                    {data.companyWebsite ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Visit {data.companyName}'s Website</p>
                            {claimButtonsState.companyWebsite.claim ? (
                                <button onClick={() => handleClaimClick('companyWebsite')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.companyWebsite.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('companyWebsite')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('companyWebsite')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}



                    {/* Follow on X (Twitter) */}
                    {data.twitter ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow BountyTap on X </p>
                            {claimButtonsState.X.claim ? (
                                <button onClick={() => handleClaimClick('X')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (

                                claimButtonsState.X.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('X')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "

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
                    {data.telegramChatInvite && data.telegramChatID ? (<div className='flex w-full justify-between items-center'>
                        <p className='max-w-48'>Follow BountyTap's Telegram Group</p>
                        {claimButtonsState.telegramChat.claim ? (
                            <button onClick={() => handleClaimClick('telegramChat')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold w-32  ">
                                Claim 100 Bounty
                            </button>
                        ) : (
                            hasJoinedChat ? (
                                <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claimed
                                </button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                        onClick={() => window.open(data.telegramChatInvite, '_blank')}
                                    >
                                        Go
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
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
                    {data.telegramAnnInvite && data.telegramAnnID ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow BountyTap's Telegram Channel</p>
                            {claimButtonsState.telegramAnn.claim ? (
                                <button onClick={() => handleClaimClick('telegramAnn')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold w-32  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                hasJoinedAnn ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => window.open(data.telegramAnnInvite, '_blank')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
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
                            <p className='max-w-48'>Follow BountyTap on Instagram</p>
                            {claimButtonsState.instagram.claim ? (
                                <button onClick={() => handleClaimClick('instagram')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.instagram.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('instagram')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('instagram')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    ) : (null)}

                    {/* facebook */}
                    {data.facebook ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow BountyTap on Facebook</p>
                            {claimButtonsState.facebook.claim ? (
                                <button onClick={() => handleClaimClick('facebook')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.facebook.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('facebook')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('facebook')}
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
                            <p className='max-w-48'>Subscribe BountyTap on YouTube</p>
                            {claimButtonsState.youtube.claim ? (
                                <button onClick={() => handleClaimClick('youtube')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.youtube.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('youtube')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
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
                            <p className='max-w-48'>Follow BountyTap on Discord</p>
                            {claimButtonsState.discord.claim ? (
                                <button onClick={() => handleClaimClick('discord')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.discord.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('discord')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "

                                            onClick={() => handleCheckClick('discord')}
                                        >
                                            Check
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (null)}

                    {/* medium */}
                    {data.medium ? (
                        <div className='flex w-full justify-between items-center'>
                            <p className='max-w-48'>Follow BountyTap on Medium</p>
                            {claimButtonsState.medium.claim ? (
                                <button onClick={() => handleClaimClick('medium')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.medium.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('medium')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleCheckClick('medium')}
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
                            <p className='max-w-48'>Visit BountyTap's Website</p>
                            {claimButtonsState.website.claim ? (
                                <button onClick={() => handleClaimClick('website')} className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                    Claim 100 Bounty
                                </button>
                            ) : (
                                claimButtonsState.website.claimed ? (
                                    <button className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  ">
                                        Claimed
                                    </button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
                                            onClick={() => handleGoClick('website')}
                                        >
                                            Go
                                        </button>
                                        <button
                                            className="bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 rounded-lg text-xs font-semibold  "
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
                            onSubmit={handleSubmit}
                        >
                            <input
                                type="text"
                                id="walletAddress"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)} // Update walletAddress state on change
                                placeholder={`Enter your ${data.addressType ? data.addressType : 'wallet'} address`}
                                className="px-2 py-2 w-full  text-white border border-white bg-gray-900 rounded-md max-w-64 text-xs focus:outline-none "
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-black to-[#7d5126] text-white px-6 py-2 text-xs w-[6rem] font-bold rounded-lg hover:bg-purple-600"
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        <div className="flex items-center gap-4 rounded-lg shadow-lg justify-center w-full">
                            <button
                                className="bg-gradient-to-r from-black to-[#7d5126] text-white px-6 py-2 text-xs font-semibold rounded-lg hover:bg-purple-600 w-full"
                            >
                                Wallet address submitted
                            </button>
                        </div>
                    )}

                    <div className='flex justify-between w-full '>
                        <button onClick={handleShare} className='flex justify-center items-center  gap-4 border border-[1px]-white rounded-lg py-2 px-4'>Share and get referral bonus <FaShare /></button>
                        <button
                            onClick={handlecopy}
                            className='text-2xl'
                        >
                           {copied ? (<FaCopy />):(<FaRegCopy />) }  
                        </button>
                    </div>

                </div>
            </div>



        </div>
    );
};

export default TaskItem;
