import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'
import image from '../assets/favicon.jpg'
const RightSideBar = () => {

  const { user } = useSelector(store => store.auth);


  return (
    <div className='my-10 w-[20%] mr-10 md:block hidden'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" ></AvatarImage>
            <AvatarFallback> <img className='my-8 rounded-full ' src={image} alt="" /></AvatarFallback>
          </Avatar>
        </Link>


        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
        </div>

      </div>
      <SuggestedUsers></SuggestedUsers>
    </div>
  )
}

export default RightSideBar
