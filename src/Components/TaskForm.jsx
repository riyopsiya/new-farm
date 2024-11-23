import React, { useState } from 'react';
import service from '../appwrite/database';
import { toast } from 'react-toastify';

const TaskForm = () => {
    // State for form fields and image
    const [formData, setFormData] = useState({
        companyName: '',
        taskDuration: '',
        category: '',
        addressType: '',
        telegramChatID: '',
        telegramChatInvite: '', // New state for Telegram chat invite link
        telegramAnnID: '', // Separate state for Telegram link
        telegramAnnInvite: '', // New state for Telegram announcement invite link
        twitter: '', // Twitter link
        instagram: '', // Instagram link
        facebook: '',
        linkedin: '', // LinkedIn link
        youtube: '', // YouTube link
        discord: '', // Discord link
        website: '',// Website link
        referralLink: '',


      


        companytelegramChatInvite: '', // Reset Telegram chat invite link
        companyTelegramAnnInvite: '', // Reset Telegram announcement invite link
        postLink: '', // post link
        commentPostLink: '', // post link
        appLink: '', // app link
        taskLink: '', // task link
        campaignLink: '', // campaign link
        registerLink: '', // register link
        companyTwitter: '',
        companyFacebook: '',
        companyInstagram: '',
        companyLinkedin: '',
        companyYoutube: '', // Reset YouTube link
        companyDiscord: '', // Reset Discord link
        companyWebsite: '',
        companyMedium: '',
        // companyReferralLink: '',



        // client 2
        company2Name: '',
        company2telegramChatInvite: '', // Reset Telegram chat invite link
        company2TelegramAnnInvite: '', // Reset Telegram announcement invite link
        post2Link: '', // post link
        commentPost2Link: '', // post link
        appLink2: '', // app link
        taskLink2: '', // task link
        campaignLink2: '', // campaign link
        registerLink2: '', // register link
        company2Twitter: '',
        company2Facebook: '',
        company2Instagram: '',
        company2Linkedin: '',
        company2Youtube: '', // Reset YouTube link
        company2Discord: '', // Reset Discord link
        company2Website: '',
        company2Medium: '',
        // company2ReferralLink: ''
    });
    const [image, setImage] = useState(null);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Upload the image to Appwrite storage
            let imageFileId = '';
            if (image) {
                const imageFile = await service.uploadFile(image);
                imageFileId = imageFile.$id;
            }

            // Save task data to Appwrite database
            const response = await service.addData({
                companyName: formData.companyName,
                taskDuration: formData.taskDuration,
                category: formData.category,
                addressType: formData.addressType,
                telegramChatID: formData.telegramChatID,
                telegramChatInvite: formData.telegramChatInvite, // Store Telegram chat invite link
                telegramAnnID: formData.telegramAnnID, // Store Telegram link
                telegramAnnInvite: formData.telegramAnnInvite, // Store Telegram announcement invite link
                twitter: formData.twitter,
                instagram: formData.instagram,
                linkedin: formData.linkedin,
                youtube: formData.youtube, // Store YouTube link
                discord: formData.discord, // Store Discord link
                website: formData.website, // Store website link
                medium: formData.medium, // Store website link
                referralLink: formData.referralLink,


                // client 1

                companyTelegramChatInvite: formData.companytelegramChatInvite, // Store Telegram chat invite link
                companyTelegramAnnInvite: formData.companyTelegramAnnInvite, // Store Telegram announcement invite link
                postLink: formData.postLink, // Store Telegram announcement invite link
                commentPostLink: formData.commentPostLink, // Store Telegram announcement invite link
                appLink: formData.appLink, // Store Telegram announcement invite link
                taskLink: formData.taskLink, // Store Telegram announcement invite link
                campaignLink: formData.campaignLink, // Store Telegram announcement invite link
                registerLink: formData.registerLink, // Store Telegram announcement invite link

                companyTwitter: formData.companyTwitter,
                companyInstagram: formData.companyInstagram,
                companyLinkedin: formData.companyLinkedin,
                companyYoutube: formData.companyYoutube, // Store YouTube link
                companyDiscord: formData.companyDiscord, // Store Discord link
                companyWebsite: formData.companyWebsite, // Store website link
                // companyReferralLink: formData.companyReferralLink,
                companyMedium: formData.companyMedium,
                
                
                // client2 
                company2Name: formData.company2Name,
                company2telegramChatInvite: formData.company2telegramChatInvite, // Store Telegram chat invite link
                company2TelegramAnnInvite: formData.company2TelegramAnnInvite, // Store Telegram announcement invite link
                post2Link: formData.post2Link, // Store post link
                commentPost2Link: formData.commentPost2Link, // Store comment post link
                appLink2: formData.appLink2, // Store app link
                taskLink2: formData.taskLink2, // Store task link
                campaignLink2: formData.campaignLink2, // Store campaign link
                registerLink2: formData.registerLink2, // Store register link

                company2Twitter: formData.company2Twitter, // Store Twitter link
                company2Facebook: formData.company2Facebook, // Store Facebook link
                company2Instagram: formData.company2Instagram, // Store Instagram link
                company2Linkedin: formData.company2Linkedin, // Store LinkedIn link
                company2Youtube: formData.company2Youtube, // Store YouTube link
                company2Discord: formData.company2Discord, // Store Discord link
                company2Website: formData.company2Website, // Store website link
                // company2ReferralLink: formData.company2ReferralLink, // Store referral link
                company2Medium: formData.company2Medium,// Store Medium link


                image: imageFileId, // Store image file ID
            });


            // Clear form after submission
            setFormData({

                companyName: '',
                taskDuration: '',
                category: '',
                addressType: '',
                telegramChatID: '',
                telegramChatInvite: '', // Reset Telegram chat invite link
                telegramAnnID: '',
                telegramAnnInvite: '', // Reset Telegram announcement invite link
                twitter: '',
                facebook: '',
                instagram: '',
                linkedin: '',
                youtube: '', // Reset YouTube link
                discord: '', // Reset Discord link
                website: '',
                medium: '',
                referralLink: '',



                companytelegramChatInvite: '', // Reset Telegram chat invite link
                companyTelegramAnnInvite: '', // Reset Telegram announcement invite link
                postLink: '', // Reset Telegram announcement invite link
                commentPostLink: '', // Reset Telegram announcement invite link
                appLink: '', // app link
                taskLink: '', // task link
                campaignLink: '', // campaign link
                registerLink: '', // register link
                companyTwitter: '',
                companyFacebook: '',
                companyInstagram: '',
                companyLinkedin: '',
                companyYoutube: '', // Reset YouTube link
                companyDiscord: '', // Reset Discord link
                companyWebsite: '',
                companyMedium: '',
                // companyReferralLink: '',


                // client 2

                company2Name: '', 
                company2telegramChatInvite: '', // Reset Telegram chat invite link
                company2TelegramAnnInvite: '', // Reset Telegram announcement invite link
                post2Link: '', // post link
                commentPost2Link: '', // post link
                appLink2: '', // app link
                taskLink2: '', // task link
                campaignLink2: '', // campaign link
                registerLink2: '', // register link
                company2Twitter: '',
                company2Facebook: '',
                company2Instagram: '',
                company2Linkedin: '',
                company2Youtube: '', // Reset YouTube link
                company2Discord: '', // Reset Discord link
                company2Website: '',
                company2Medium: '',
                // company2ReferralLink: ''
            });
            setImage(null);


            toast.success('Task added successfully.')
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Handle input change for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="p-8 ">
            <h2 className="text-2xl font-bold mb-4">Add Task</h2>
            <form onSubmit={handleSubmit} className='mb-10'>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Client Name</label>
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Name of Client"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Task Duration <span className='text-gray-400'>( in hours )</span></label>
                    <input
                        type="text"
                        name="taskDuration"
                        value={formData.taskDuration}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        placeholder="e.g., 12 , 24 "
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 w-40" htmlFor="category">Category<span className="text-red-500 ml-2">*</span></label>
                    <select id="category" name="category" className="w-full px-1 py-2 bg-black text-white border border-transparent rounded-lg" value={formData.category} onChange={handleInputChange} required>
                        <option value="" className="bg-black text-black" disabled>Select a category</option>
                        <option value="social">Social</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 w-40" htmlFor="addressType">Wallet Address<span className="text-red-500 ml-2">*</span></label>
                    <select id="addressType" name="addressType" className="w-full px-1 py-2 bg-black text-white border border-transparent rounded-lg" value={formData.addressType} onChange={handleInputChange} required>
                        <option value="" className="bg-black text-black" disabled>Select an address type</option>
                        <option value="BEP-20">BEP-20</option>
                        <option value="Solana">Solana</option>
                        <option value="ETH">ETH</option>
                        <option value="TRC-20">TRC-20</option>
                        <option value="TG username/TON">TG username/TON</option>
                        <option value="BRC-20">BRC-20</option>
                        <option value="Base">Base</option>
                        <option value="Avalanche">Avalanche</option>
                        <option value="Near">Near</option>
                    </select>
                </div>



                {/* social media links for BountyTap */}
                <div className="mb-4 ">
                    <label className="block text-sm font-bold mb-2">Social Media Links (BountyTap)</label>
                    <input
                        type="text"
                        name="twitter"
                        placeholder="Twitter Link"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder='Telegram Chat ID'
                        name="telegramChatID"
                        value={formData.telegramChatID}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"

                    />

                    <input
                        type="text"
                        name="telegramChatInvite"
                        placeholder='Telegram Chat Link'
                        value={formData.telegramChatInvite}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        name="telegramAnnID"
                        placeholder='Telegram Ann ID'
                        value={formData.telegramAnnID}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"

                    />

                    <input
                        type="text"
                        name="telegramAnnInvite"
                        placeholder='Telegram Announcement Link'
                        value={formData.telegramAnnInvite}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />



                    <input
                        type="text"
                        name="linkedin"
                        placeholder="LinkedIn Link"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        name="instagram"
                        placeholder="Instagram Link"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        name="youtube"
                        placeholder="YouTube Link"
                        value={formData.youtube}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        name="discord"
                        placeholder="Discord Link"
                        value={formData.discord}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        name="website"
                        placeholder="Website Link"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        name="facebook"
                        placeholder="Facebook Link"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        name="medium"
                        placeholder="Medium Link"
                        value={formData.medium}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        name="referralLink"
                        placeholder="Referral Link"
                        value={formData.referralLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                    />

                </div>


                {/* social media links for client 1 */}

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Social Media Links (Client 1)</label>


                    <input
                        type="text"
                        placeholder="Client 1 Twitter Link"
                        name="companyTwitter"
                        value={formData.companyTwitter}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder='Client 1 Telegram Chat Link'
                        name="companytelegramChatInvite"
                        value={formData.companytelegramChatInvite}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder='Client 1 Telegram Announcement Link'
                        name="companyTelegramAnnInvite"
                        value={formData.companyTelegramAnnInvite}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 1 Post Link for tagging 3 friends"
                        name="postLink"
                        value={formData.postLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Client 1 Post Link for commenting"
                        name="commentPostLink"
                        value={formData.commentPostLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Client 1 app Link"
                        name="appLink"
                        value={formData.appLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Client 1 task Link"
                        name="taskLink"
                        value={formData.taskLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Client 1 Campaign Link "
                        name="campaignLink"
                        value={formData.campaignLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Client 1 Registration Link"
                        name="registerLink"
                        value={formData.registerLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />


                    <input
                        type="text"
                        placeholder="Client 1 Instagram Link"
                        name="companyInstagram"
                        value={formData.companyInstagram}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 1 LinkedIn Link"
                        name="companyLinkedin"
                        value={formData.companyLinkedin}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 1 YouTube Link"
                        name="companyYoutube"
                        value={formData.companyYoutube}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 1 Discord Link"
                        name="companyDiscord"
                        value={formData.companyDiscord}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 1 Website Link"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />


                    <input
                        type="text"
                        placeholder="Client 1 Medium Link"
                        name="companyMedium"
                        value={formData.companyMedium}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                    />

                    {/* <input
                        type="text"
                        placeholder="Client Referral Link"
                        name="companyReferralLink"
                        value={formData.companyReferralLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    /> */}
                </div>





                {/* Social Media Links for Client 2 */}

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Social Media Links (Client 2)</label>

                    <input
                        type="text"
                        placeholder="Client 2 Name"
                        name="company2Name"
                        value={formData.company2Name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Client 2 Twitter Link"
                        name="company2Twitter"
                        value={formData.company2Twitter}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Telegram Chat Link"
                        name="company2telegramChatInvite"
                        value={formData.company2telegramChatInvite}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Telegram Announcement Link"
                        name="company2TelegramAnnInvite"
                        value={formData.company2TelegramAnnInvite}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Post Link for tagging 3 friends"
                        name="post2Link"
                        value={formData.post2Link}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Post Link for commenting"
                        name="commentPost2Link"
                        value={formData.commentPost2Link}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 App Link"
                        name="appLink2"
                        value={formData.appLink2}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Task Link"
                        name="taskLink2"
                        value={formData.taskLink2}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Campaign Link"
                        name="campaignLink2"
                        value={formData.campaignLink2}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Registration Link"
                        name="registerLink2"
                        value={formData.registerLink2}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Instagram Link"
                        name="company2Instagram"
                        value={formData.company2Instagram}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 LinkedIn Link"
                        name="company2Linkedin"
                        value={formData.company2Linkedin}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 YouTube Link"
                        name="company2Youtube"
                        value={formData.company2Youtube}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Discord Link"
                        name="company2Discord"
                        value={formData.company2Discord}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />

                    <input
                        type="text"
                        placeholder="Client 2 Website Link"
                        name="company2Website"
                        value={formData.company2Website}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black mb-2"
                    />



                    <input
                        type="text"
                        placeholder="Client 2 Medium Link"
                        name="company2Medium"
                        value={formData.company2Medium}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                    />
                </div>



                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Task Image</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full p-2 border rounded bg-black"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Add Task
                </button>
            </form>
        </div>

    )
}

export default TaskForm
