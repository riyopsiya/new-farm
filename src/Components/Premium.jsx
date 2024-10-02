import React from 'react'
import CompanyCard from './TaskItem'

const Premium = () => {
  return (
    <div>
               {/* Tasks Available */}
               <div className="flex justify-center my-4">
                <div className="border border-gray-400 rounded-md px-4 py-2 text-sm">
                    4 tasks available
                </div>
            </div>

       

            {/* Task List */}
            <div className="space-y-4">
                {/* Task Item */}
                <CompanyCard />
                <CompanyCard />
               
                
            </div>
    </div>
  )
}

export default Premium
