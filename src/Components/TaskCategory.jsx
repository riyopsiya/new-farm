import React from 'react'
import Premium from './Premium';
import Social from './Social';

const TaskCategory = ({category}) => {
    console.log(category)
    if (category==='premium') {
        return  <Premium />;
  }
  return (
    <Social/>
  )
}

export default TaskCategory
