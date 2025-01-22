import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center p-2 sm:pl-[20%] w-full'>
      <Posts></Posts>
    </div>
  )
}

export default Feed
