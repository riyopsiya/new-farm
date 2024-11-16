import React from 'react';
import { useSelector } from 'react-redux';
import { FaCopy } from "react-icons/fa6";
import { toast } from 'react-toastify';

const ReferralPage = () => {
    const { userData } = useSelector((state) => state.user);
    const referralCode = userData?.referralCode;
    const appInviteLink = "http://t.me/bountytapbot/BountyTap";

    const message = `🚀 Join me on BountyTap and start earning rewards! 🚀

Earn guaranteed rewards and exclusive bonuses with BountyTap! Don’t miss out on this opportunity to start your earning journey today.

🔗 App Link: ${appInviteLink}?startapp=${referralCode}

💰 Use my referral code to get a bonus of 2000 coins: ${referralCode}`;

    const handleInviteClick = () => {
   
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(message)}`;

        if (window.Telegram?.WebApp) {
            // Open the Telegram share link directly within the Telegram WebApp
            window.Telegram.WebApp.openLink(telegramUrl);
        } else {
            // Fallback for environments not supporting Telegram WebApp
            window.open(telegramUrl, '_blank');
        }
    };
    const handlecopy = () => {
        navigator.clipboard.writeText(message)
        toast.success(" Referral link copied ")
    };


    return (
        <div className="text-white min-h-screen p-6 flex flex-col items-center justify-start gap-4 mb-8 gradient2">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4">Invite Friends & Earn Rewards</h2>

            {/* How it works */}
            <div className="p-4 mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
                <div className="relative pl-6 space-y-8">
                    {/* Step 1 */}
                    <div className="absolute h-[11rem] w-px bg-orange-500 left-2 top-4"></div>
                    <div className="flex items-start">
                        <div className="h-4 w-4 absolute left-[1px] mt-1 top-1 bg-black border-[5px] border-[#7d5126] rounded-full"></div>
                        <div className="ml-4">
                            <p className="text-white font-semibold">Share your referral link</p>
                            <p className="text-gray-400">Spread BountyTap among your friends</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start">
                        <div className="h-4 w-4 absolute left-[1px] mt-1  bg-black border-[5px] border-[#7d5126] rounded-full"></div>
                        <div className="ml-4">
                            <p className="text-white font-semibold">Your friends join BountyTap</p>
                            <p className="text-gray-400">And begin farming tokens</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className=" flex items-start">
                        <div className="h-4 w-4 absolute left-[1px] mt-1  bg-black border-[5px] border-[#7d5126] rounded-full"></div>
                        <div className="ml-4">
                            <p className="text-white font-semibold">Earn 1,000 Bounty tokens for each referral</p>
                            <p className="text-gray-400">Your friend earns 1,000 coins when they sign up with your link</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite button */}

            <div className='flex justify-between w-full gap-4'>

                <button onClick={handleInviteClick} className="bg-gradient-to-r from-black to-[#7d5126] text-white font-semibold py-2 px-4 rounded-md w-full">
                    Invite Your Friends
                </button>

                <button
                    onClick={handlecopy}
                    className='text-2xl'
                >
                    <FaCopy />
                </button>
            </div>
        </div>


    );
};

export default ReferralPage;
