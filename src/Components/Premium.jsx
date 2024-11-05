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
  const [openTaskId, setOpenTaskId] = useState(null);
  const { userInfo } = useSelector((state) => state.user);

  // const userId = 1337182007;
  // const userId = 1751474467;
  const userId = userInfo?.id;

  // Function to determine if a task is expired
  const isTaskExpired = (task) => {
    const currentTime = Date.now();
    const taskCreatedTime = new Date(task.$createdAt).getTime();
    const durationInMs = parseInt(task.taskDuration, 10) * 60 * 60 * 1000;

    return currentTime - taskCreatedTime >= durationInMs;
  };

  // Function to determine if a task is within the 30-day grace period after expiry
  const isWithinGracePeriod = (task) => {
    const currentTime = Date.now();
    const taskCreatedTime = new Date(task.$createdAt).getTime();
    const durationInMs = parseInt(task.taskDuration, 10)* 60 * 60 * 1000;
    const gracePeriodInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    // Check if the current time is within 30 days after the task expiry
    return currentTime <= taskCreatedTime + durationInMs + gracePeriodInMs;
  };

  // Function to separate tasks based on userTasks, filtering expired and completed tasks with grace period
  const separateTasks = (userTasks, premiumTasksData) => {
    const completed = premiumTasksData?.filter(
      task => userTasks?.includes(task.$id) && isWithinGracePeriod(task)
    ) || [];
    const notCompleted = premiumTasksData?.filter(
      task => !userTasks?.includes(task.$id) && !isTaskExpired(task)
    ) || [];

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

        setPremiumTasks(premiumTasksData.documents || []);
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

  const handleToggleTask = (taskId) => {
    setOpenTaskId((prevOpenTaskId) => (prevOpenTaskId === taskId ? null : taskId));
  };

  // if (loading) {
  //   return <div><LoadingSkeleton /></div>;
  // }

  if (premiumTasks.length === 0) {
    return <div className='flex h-[60vh] items-center justify-center my-8 text-gray-400 font-semibold'>No tasks available</div>;
  }

  return (
    <div>
      {notCompletedTasks?.length > 0 ? (
        <div>
          <div className="flex justify-center my-4">
            <div className="border border-gray-400 rounded-md px-4 py-2 text-sm font-semibold">
            { `${notCompletedTasks.length} new ${notCompletedTasks.length > 1 ? 'tasks' : 'task'} available`}
            </div>
          </div>

          <div className="space-y-4">
            {notCompletedTasks.map((data) => (
              <TaskItem
                key={data.$id}
                data={data}
                isOpen={openTaskId === data.$id}
                onToggle={() => handleToggleTask(data.$id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-12">No new tasks available</div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <div className="flex justify-center my-4">
            <div className="border border-gray-400 rounded-md px-4 py-2 mt-6 text-sm">
              {completedTasks.length} {completedTasks.length > 1 ? 'tasks' : 'task'} completed
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {completedTasks.map((data) => (
              <TaskItem
                key={data.$id}
                data={data}
                isOpen={openTaskId === data.$id}
                onToggle={() => handleToggleTask(data.$id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
