import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { setAuthUser, setUserProfile } from '@/slices/authSlice';
import { toast } from 'sonner';
import image from '../assets/favicon.jpg'

const SuggestedUsers = () => {

  const { suggestedUsers, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const followorUnFollow = async (userId) => {
    try {
      //first I will follow them and then Will unfollow the,
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/followorunfollow/${userId}`, {}, { withCredentials: true });

     

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        dispatch(setUserProfile(res.data.userProfile));
      }


    }
    catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
      dispatch(setAuthUser(null));
      navigate('/login');
    }
  }

  return (

    <div className=' my-10 p-2'>
      <div className='flex items-center gap-8 text-sm justify-between'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer '>See All</span>
      </div>
      {
        suggestedUsers?.map((userProfile) => {
          return (
            <div key={userProfile?._id} className='flex items-center justify-between my-5'>
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${userProfile?._id}`}>
                  <Avatar>
                    <AvatarImage src={userProfile?.profilePicture} alt="post_image" ></AvatarImage>
                    <AvatarFallback> <img className=' rounded-full ' src={image} alt="" /></AvatarFallback>
                  </Avatar>
                </Link>


                <div>
                  <h1 className='font-semibold text-sm'><Link to={`/profile/${userProfile?._id}`}>{userProfile?.username}</Link></h1>
                  <span className='text-gray-600 text-sm'>{userProfile?.bio || 'Bio here...'}</span>
                </div>

              </div>
              {
                user && user.following.includes(userProfile?._id) ? (<span type='button' onClick={() => followorUnFollow(userProfile?._id)} className='bg-gray-200 p-1 rounded-xl text-xs font-bold cursor-pointer hover:text-[#cec7c5]'>UnFollow</span>) :
                  (<span type='button' onClick={() => followorUnFollow(userProfile._id)} className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3BADF8]'>Follow</span>)

              }
            </div>
          )
        })
      }
    </div>
  )
}

export default SuggestedUsers
