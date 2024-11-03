import React from 'react';
import { useSelector } from 'react-redux';

const ReferralPage = () => {

    const { userData } = useSelector((state) => state.user);
    
    const handleInviteClick = () => {
        const referralCode = userData?.referralCode;
        const appInviteLink = "http://t.me/notcoincollablybot/notcoinbot"; // Replace with your actual invite link
        const message = `🚀 Join me on Bounty Tap and start earning rewards!\n\n🔗 App Link: ${appInviteLink}\n\n💰 Use my referral code to get started: ${referralCode}\n\nTap here to copy the referral code: https://t.me/share/url?url=${encodeURIComponent(referralCode)}`;
    
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(`https://t.me/share/url?url=${encodeURIComponent(message)}`);
        } else {
            console.log("Telegram WebApp not available.");
        }
    };

    return (
        <div className=" text-white min-h-screen p-6 flex flex-col items-center justify-start gap-8">

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 ">Invite Friends & Earn Rewards</h2>

            {/* How it works */}
            <div className="p-4 ">
                <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
                <div className="relative pl-6 space-y-8">
                    {/* Step 1 */}
                    <div className="absolute h-[11rem] w-px bg-orange-500  left-2 top-4"></div>
                    <div className="flex items-start">
                        <div className="h-4 w-4 absolute left-[1px] top-1 bg-black  border-[5px] border-[#7d5126] rounded-full"></div>
                        <div className="ml-4">
                            <p className="text-white font-semibold">Share your referral link</p>
                            <p className="text-gray-400">Spread Bounty Task among your friends.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start">
                        <div className="h-4 w-4 absolute left-[1px] bg-black    border-[5px] border-[#7d5126] rounded-full"></div>
                        <div className="ml-4">
                            <p className="text-white font-semibold">Your friends join Bounty Task</p>
                            <p className="text-gray-400">And begin farming tokens.</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start">
                        <div className="h-4 w-4 absolute left-[1px]  bg-black   border-[5px] border-[#7d5126] rounded-full"></div>
                        <div className="ml-4">
                            <p className="text-white font-semibold">Earn 10% from your friend's farming</p>
                            <p className="text-gray-400">Plus an additional 2.5% from their friends.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite button */}
            <button  onClick={handleInviteClick} className="bg-gradient-to-r from-black to-[#7d5126] text-white font-semibold py-2 px-4 rounded-md w-full">
                Invite Your Friends
            </button>


        </div>
    );
};

export default ReferralPage;
