import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import service from '../appwrite/database';
import LoadingSkeleton from './Loading';

const Premium = () => {
  const [loading, setLoading] = useState(true);
  const [premiumTasks, setPremiumTasks] = useState([]);

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const premiumTasksData = await service.getAllData('premium');
        console.log('Fetched social tasks:', premiumTasksData.documents);
       
        if (premiumTasksData?.documents) {
          setPremiumTasks(premiumTasksData.documents);
        }

      } catch (error) {
        console.error('Error fetching social tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksData();
  }, []);

  if (loading) {
    return <div> <LoadingSkeleton/> </div>;
  }

  if (premiumTasks.length === 0) {
    return <div className='flex justify-center my-8'>No tasks available</div>;
  }

  return (
    <div>
      <div className="flex justify-center my-4">
        <div className="border border-gray-400 rounded-md px-4 py-2 text-sm">
          {premiumTasks?.length} tasks available
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {premiumTasks.map((data) => (
          <TaskItem key={data.$id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Premium;
