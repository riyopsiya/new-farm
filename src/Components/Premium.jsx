import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import service from '../appwrite/database';
import LoadingSkeleton from './Loading';
import { useSelector } from 'react-redux';

const Premium = () => {
  const [loading, setLoading] = useState(true);
  const [premiumTasks, setPremiumTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notCompletedTasks, setNotCompletedTasks] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null); // State to track the open task
  const { userInfo } = useSelector((state) => state.user);  

  // const userId = 1337182007
  const userId = userInfo?.id
  // Function to separate tasks based on userTasks
  const separateTasks = (userTasks, premiumTasksData) => {
    // Log the fetched premium tasks data
    console.log('Premium Tasks Data:', premiumTasksData);

    // Use the correct array for filtering
    const completed = premiumTasksData?.filter(task => userTasks.includes(task.$id)) || [];
    const notCompleted = premiumTasksData?.filter(task => !userTasks.includes(task.$id)) || [];

    return { completed, notCompleted };
  };

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        // Fetch user data from the service
        const userData = await service.getUser(userId);
        const userTasks = userData.tasks;

        // Fetch premium tasks data
        const premiumTasksData = await service.getAllData('premium');
        console.log('Fetched premium tasks:', premiumTasksData.documents);

        // Separate the tasks
        const { completed, notCompleted } = separateTasks(userTasks, premiumTasksData.documents);
        console.log('Completed Tasks:', completed);
        console.log('Not Completed Tasks:', notCompleted);

        // Set premium tasks and their completed status
        if (premiumTasksData?.documents) {
          setPremiumTasks(premiumTasksData.documents);
        }
        setCompletedTasks(completed);
        setNotCompletedTasks(notCompleted);
      } catch (error) {
        console.error('Error fetching premium tasks:', error);
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

  if (premiumTasks.length === 0) {
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
      </div>) : (
        <div className="flex justify-center mt-12">No new tasks available</div>
      )}
      {completedTasks.length ? (
        <div>

          <div className="flex justify-center my-4">
            <div className="border border-gray-400 rounded-md px-4 py-2 mt-6 text-sm">
              {completedTasks.length > 0
                ? `${completedTasks.length} ${completedTasks.length > 1 ? 'tasks' : 'task'} completed`
                : 'No tasks completed'}
            </div>
          </div>

          {/* Task List for Completed Tasks */}
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

export default Premium;
