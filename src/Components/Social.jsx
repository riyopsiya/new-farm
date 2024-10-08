import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import service from '../appwrite/database';
import LoadingSkeleton from './Loading';

const Social = () => {
  const [loading, setLoading] = useState(true);
  const [socialTasks, setSocialTasks] = useState([]);
  


  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const socialTasksData = await service.getAllData('social');
        console.log('Fetched social tasks:', socialTasksData.documents);
        
        if (socialTasksData?.documents) {
          setSocialTasks(socialTasksData.documents);
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

  if (socialTasks.length === 0) {
    return <div className='flex justify-center my-4'>No tasks available</div>;
  }

  return (
    <div>
      <div className="flex justify-center my-4">
        <div className="border border-gray-400 rounded-md px-4 py-2 text-sm">
          {socialTasks?.length} tasks available
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {socialTasks.map((data) => (
          <TaskItem key={data.$id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Social;
