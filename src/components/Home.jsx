import React, { useEffect } from 'react'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import { Outlet, useLocation } from 'react-router-dom'
import useGetAllPosts from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'


   



const Home = () => {
  
  


  

  useGetAllPosts();
  useGetSuggestedUsers();  
  return (
    <div className='flex w-[full]'>
      <div className='flex-grow w-full'>
        <Feed></Feed>
        <Outlet></Outlet>
      </div>
       <RightSideBar></RightSideBar>
    </div>
  )
}

export default Home
