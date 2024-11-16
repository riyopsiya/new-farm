import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import service from '../appwrite/database';

import TaskImport from '../Components/TaskImport';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const { userInfo } = useSelector((state) => state.user);  
    const [loading, setLoading] = useState(true);
    const [socialTasks, setSocialTasks] = useState([]);
    const [premiumTasks, setPremiumTasks] = useState([]);
    const navigate = useNavigate();

    // Check admin access
    useEffect(() => {
        const adminId1 = parseInt(process.env.REACT_APP_ADMIN_ID_1);
        const adminId2 = parseInt(process.env.REACT_APP_ADMIN_ID_2);

        if (!userInfo || (userInfo?.id !== adminId1 && userInfo?.id !== adminId2))  {
            // Redirect to home page or unauthorized page
            navigate('/'); // Ensure you have an unauthorized route
        }
    }, [userInfo, navigate]);


    useEffect(() => {
   

        const fetchTasksData = async () => {
            try {


                // Fetch social tasks data
                const socialTasksData = await service.getAllData('social');
                // console.log('Fetched social tasks:', socialTasksData);

                setSocialTasks(socialTasksData.documents || []);
                // Fetch premium tasks data
                const premiumTasksData = await service.getAllData('premium');
                setPremiumTasks(premiumTasksData.documents || []);

            } catch (error) {
                console.error('Error fetching social tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasksData();
    }, []);

    return (
        <div className='py-6 px-4'>
            {/* header  */}
            <header className='flex justify-between items-center  mb-6 border-b-2 border-[#272626] pb-6 '>
                <p>Hello,Admin </p>
                <NavLink to={'/taskform'} className='bg-gradient-to-r from-black to-[#7d5126] px-2 py-2 text-sm  rounded-lg  '>Add Task</NavLink>
            </header>

            <h2 className="text-lg font-semibold text-center mb-4">All Tasks</h2>

                       
            {/* Task List */}
            <div className=" shadow rounded mt-2 ">
                {socialTasks.length === 0 ? (
                    null
                ) : (
                    <div className='py-4 px-4 rounded-md bg-[#151515] flex flex-col gap-4'>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Social Tasks</h2>

                       
                            {socialTasks.map((task) => (
                               <TaskImport key={task.$id} data={task} />
                            ))}
                        
                    </div>
                )}
            </div>


            <div className=" shadow rounded mt-4 ">
                {premiumTasks.length === 0 ? (
                    null
                ) : (
                    <div className='py-4 px-4 rounded-md bg-[#151515] flex flex-col gap-4'>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Premium Tasks</h2>

                       
                            {premiumTasks.map((task) => (
                               <TaskImport key={task.$id} data={task} />
                            ))}
                       
                    </div>
                )}
            </div>

          

        </div>
    );
};

export default AdminDashboard;
