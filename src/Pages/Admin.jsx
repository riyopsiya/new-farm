import React, { useState } from 'react';
import { Client, Databases, Storage } from 'appwrite';
import service from '../appwrite/database';

const AdminDashboard = () => {
    // State for form fields and image
    const [formData, setFormData] = useState({
        taskName: '',
        companyName: '',
        taskDuration: '',
        category: '',
        telegramChatID: '',
        telegramAnn: '',  // Separate state for Telegram link
        twitter: '',   // Separate state for Twitter link
        instagram: '',   // Separate state for Twitter link
        linkedin: '',   // Separate state for Twitter link
        website: ''   // Separate state for LinkedIn link
    });
    const [image, setImage] = useState(null);

  
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Upload the image to Appwrite storage
            let imageFileId = '';
            if (image) {
               
                const imageFile = await service.uploadFile( image);
                
                imageFileId = imageFile.$id;
            }
            console.log(formData)
            // Save task data to Appwrite database
                  const response = await service.addData({
                    taskName: formData.taskName,
                    companyName: formData.companyName,
                    taskDuration: formData.taskDuration, // E.g., "1 day", "2 days"
                    category: formData.category, // E.g., "1 day", "2 days"
                    telegramChatID: formData.telegramChatID,
                    telegramAnn: formData.telegramAnn,  // Store Telegram link
                    twitter: formData.twitter,    // Store Twitter link
                    instagram: formData.instagram,    // Store instagram link
                    linkedin: formData.linkedin,  // Store LinkedIn link
                    website: formData.website,  // Store LinkedIn link
                    image: imageFileId, // Store image file ID
                    // users: [JSON.stringify({'name':'hardik','id':'123455'}),JSON.stringify({'name':'vivek','id':'345555'})] // Store image file ID
                    
                }
            );
            console.log('Task added successfully:', response);

            // Clear form after submission
            setFormData({
                taskName: '',
                companyName: '',
                taskDuration: '',
                category: '',
                telegramChatID: '',
                telegramAnn: '',
                twitter: '',
                instagram: '',
                linkedin: '',
                website: ''
            });
            setImage(null);

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
                    <label className="block text-sm font-bold mb-2">Task Name</label>
                    <input
                        type="text"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Task Duration</label>
                    <input
                        type="text"
                        name="taskDuration"
                        value={formData.taskDuration}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black  "
                        placeholder="e.g., 12 hrs, 24 hrs"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 w-40" htmlFor="category">Exchange Type<span className="text-red-500 ml-2">*</span></label>
                    <select id="category" name="category" className="w-full px-1 py-2 bg-black text-white border border-transparent rounded-lg" value={formData.category} onChange={handleInputChange} required>
                        <option value="" className="bg-black text-black" disabled>Select a category</option>
                        <option value="social">Social</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>



                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Telegram Group ID</label>
                    <input
                        type="text"
                        name="telegramChatID"
                        value={formData.telegramChatID}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Telegram Ann ID</label>
                    <input
                        type="text"
                        name="telegramAnn"
                        value={formData.telegramAnn}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Social Media Links</label>
                   
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
                        name="linkedin"
                        placeholder="LinkedIn Link"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        
                    />
                    <input
                        type="text"
                        name="instagram"
                        placeholder="Instagram Link"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-black"
                        
                    />
                    <input
                        type="text"
                        name="website"
                        placeholder="Website Link"
                        value={formData.website}
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
    );
};

export default AdminDashboard;
