import React, { useEffect, useState } from 'react';
import CompanyCard from '../Components/TaskItem';
import Social from '../Components/Social';
import Premium from '../Components/Premium';
import TaskCategory from '../Components/TaskCategory';
import service from '../appwrite/database';
import { useDispatch } from 'react-redux';
import { setPremiumTasks, setSocialTasks } from '../store/dataSlice';

const Tasks = () => {
    const [category, setCategory] = useState('social')
    const [loading, setLoading] = useState(true)
    
    const dispatch = useDispatch();


      
     

    //   if (loading) {
    //      return <div>Loading...</div>;
    //   }

    return (
        <div className="min-h-screen py-4 text-white px-4 mb-16 gradient2">

            {/* Tab Switcher */}
            <div className="flex justify-around my-4 px-6 gap-2">
                <button
                    onClick={() => setCategory('social')}
                    className={`px-8 py-1 rounded-lg  w-1/2 text-white  font-semibold
                    ${category === 'social' ? 'bg-gradient-to-r from-black to-[#7d5126]' : 'border border-gray-400'}`}
                >
                    Social
                </button>

                {/* Premium Button */}
                <button
                    onClick={() => setCategory('premium')}
                    className={`px-8 py-1 rounded-lg w-1/2 text-white font-semibold
                    ${category === 'premium' ? 'bg-gradient-to-r from-black to-[#7d5126]' : 'border border-gray-400'}`}
                >
                    Premium
                </button>
            </div>
            <TaskCategory category={category} />






        </div>
    );
};



export default Tasks;
