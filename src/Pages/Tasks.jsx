import React, {  useState } from 'react';
import TaskCategory from '../Components/TaskCategory';


const Tasks = () => {
    const [category, setCategory] = useState('social')
  
    

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
