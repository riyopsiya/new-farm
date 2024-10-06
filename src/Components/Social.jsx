import React, { useEffect } from 'react'
import TaskItem from './TaskItem'
import { useDispatch, useSelector } from 'react-redux'
import service from '../appwrite/database'
import { setSocialTasks } from '../store/dataSlice'

const Social = () => {
  const { socialTasks } = useSelector(state => state.tasks)
  console.log(socialTasks)

  // if (socialTasks?.length===0) {
  //   return  <div className='flex justify-center my-4'>No tasks available</div>

  // }

  return (


    <div>

      {socialTasks && <div className="flex justify-center my-4">
        <div className="border border-gray-400 rounded-md px-4 py-2 text-sm">
          {socialTasks?.length} tasks available
        </div>
      </div>}




      {/* Task List */}
      <div className="space-y-4">
        {socialTasks && socialTasks?.map((data) => {
          return <TaskItem key={data.$id} data={data} />
        })}


      </div>
    </div>
  )
}

export default Social
