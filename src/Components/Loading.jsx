import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse pt-4  ">
        <div className='flex flex-col items-center'>
      <div className="bg-gray-900 h-12 w-48  rounded-md mb-4"></div> {/* Image Placeholder */}

        </div>
      <div className="bg-gray-900 h-32 rounded-md mb-4"></div> {/* Image Placeholder */}
      <div className="bg-gray-900 h-32 rounded-md mb-4"></div> {/* Image Placeholder */}
      <div className="bg-gray-900 h-32 rounded-md mb-4"></div> {/* Image Placeholder */}

    
    </div>
  );
};

export default LoadingSkeleton;
