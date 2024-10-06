import React from 'react'
import TaskItem from './TaskItem'
import { useSelector } from 'react-redux'

const Premium = () => {
  const { premiumTasks } = useSelector(state => state.tasks)
  console.log(premiumTasks)

  // if (premiumTasks?.length === 0) {
  //   return  <div className='flex justify-center my-4'>No tasks available</div>

  // }
  return (
    <div>
      {/* Tasks Available */}
      <div className="flex justify-center my-4">
        <div className="border border-gray-400 rounded-md px-4 py-2 text-sm">
          {premiumTasks?.length} tasks available
        </div>
      </div>



      {/* Task List */}
      <div className="space-y-4">
        {premiumTasks && premiumTasks.map((data) => {
          return <TaskItem key={data.$id} data={data} />
        })}


      </div>
    </div>
  )
}

export default Premium
