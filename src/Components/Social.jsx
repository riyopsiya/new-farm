import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import service from '../appwrite/database';
import LoadingSkeleton from './Loading';
import { not } from 'ajv/dist/compile/codegen';
import { useSelector } from 'react-redux';

const Social = () => {
  const [loading, setLoading] = useState(true);
  const [socialTasks, setSocialTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notCompletedTasks, setNotCompletedTasks] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null); // State to track the open task
  const { userInfo } = useSelector((state) => state.user);  

  const userId = 1337182007
  // const userId = userInfo?.id

  // Function to separate tasks based on userTasks
  const separateTasks = (userTasks, socialTasksData) => {
    // Log the fetched social tasks data
    console.log('Social Tasks Data:', socialTasksData);

    // Use the correct array for filtering
    const completed = socialTasksData?.filter(task => userTasks.includes(task.$id)) || [];
    const notCompleted = socialTasksData?.filter(task => !userTasks.includes(task.$id)) || [];

    return { completed, notCompleted };
  };


  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        // Fetch user data from the service
        const userData = await service.getUser(userId);
        const userTasks = userData.tasks;

        // Fetch social tasks data
        const socialTasksData = await service.getAllData('social');
        console.log('Fetched social tasks:', socialTasksData.documents);

        // Separate the tasks
        const { completed, notCompleted } = separateTasks(userTasks, socialTasksData.documents);
        console.log('Completed Tasks:', completed);
        console.log('Not Completed Tasks:', notCompleted);

        // Check if socialTasksData.documents exists before setting state
        if (socialTasksData?.documents) {
          setSocialTasks(socialTasksData.documents);
        }
        if (completed) {
          setCompletedTasks(completed);
        }
        if (notCompleted) {
          setNotCompletedTasks(notCompleted);
        }
      } catch (error) {
        console.error('Error fetching social tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksData();
  }, []);

  // Function to toggle the open task
  const handleToggleTask = (taskId) => {
    setOpenTaskId((prevOpenTaskId) => (prevOpenTaskId === taskId ? null : taskId));
  };

  if (loading) {
    return <div><LoadingSkeleton /></div>;
  }

  if (socialTasks.length === 0) {
    return <div className='flex h-[60vh] items-center justify-center my-8 text-gray-400 font-semibold'>No tasks available</div>;
  }

  return (
    <div>

      {notCompletedTasks?.length > 0 ? (<div>

        <div className="flex justify-center my-4">
          <div className="border border-gray-400 rounded-md px-4 py-2 text-sm font-semibold">
            {notCompletedTasks?.length} New tasks available
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {notCompletedTasks.map((data) => (
            <TaskItem
              key={data.$id}
              data={data}
              isOpen={openTaskId === data.$id} // Pass whether this task is open
              onToggle={() => handleToggleTask(data.$id)} // Pass toggle function
            />
          ))}
        </div>
      </div>) : (null)}


      {completedTasks?.length > 0 ? (
        <div>
          <div className="flex justify-center my-4  ">
            <div className="border border-gray-400 rounded-md px-4 py-2 mt-6 text-sm font-semibold">
             {completedTasks.length > 0 
      ? `${completedTasks.length} ${completedTasks.length > 1 ? 'tasks' : 'task'} completed` 
      : 'No tasks completed'}
            </div>
          </div>


          {/* Task List */}
          <div className="space-y-4 mb-8">
            {completedTasks.map((data) => (
              <TaskItem
                key={data.$id}
                data={data}
                isOpen={openTaskId === data.$id} // Pass whether this task is open
                onToggle={() => handleToggleTask(data.$id)} // Pass toggle function
              />
            ))}
          </div>
        </div>
      ) : (null)}
    </div>
  );
};

export default Social;
