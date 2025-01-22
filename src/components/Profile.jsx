
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign } from 'lucide-react';
import { setAuthUser, setUserProfile } from '@/slices/authSlice';
import axios from 'axios';
// import CommentDialog from './CommentDialog';
// import { setSelectedPost } from '@/slices/postSlice';
// import { FaRegHeart, FaHeart } from 'react-icons/fa'
// import { toast } from 'sonner';
// import useGetAllPosts from '@/hooks/useGetAllPost';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import ProfilePost from './ProfilePost';
import { toast } from 'sonner';
import image from '../assets/favicon.jpg'
// import { AvatarFallback } from '@radix-ui/react-avatar'



const Profile = () => {

  const navigate = useNavigate();
  const { userProfile, user } = useSelector(store => store.auth);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [])


  const params = useParams();
  const userId = params.id;
  if (user)
    useGetUserProfile(userId);
  const [activeTab, setActiveTag] = useState('posts');
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isLoggedInUserProfile = user?._id == userProfile?._id;
  const [likes, setLikes] = useState([]);
  // const [openlike, setOpenLike] = useState(false); 
  const [openpop, setOpenPop] = useState(false);
  const [openpop2, setOpenPop2] = useState(false);

  let isFollowing = user?.following.includes(userProfile?._id);


  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const displayedPost = activeTab == 'posts' ? userProfile?.posts : userProfile?.bookmarks;






  const followorUnFollow = async () => {
    try {
      //first I will follow them and then Will unfollow the,
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/followorunfollow/${userProfile?._id}`, {}, { withCredentials: true });



      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        isFollowing = user.following.includes(userProfile?._id);
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


  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/getfollowers/${userProfile._id}`, { withCredentials: true });



      if (res.data.success) {
        setFollowers(res.data.followers);
        console.log('followers mil gaya ', followers);
        setOpenPop(true);
      }

    }
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(setAuthUser(null));
      navigate('/login');
    }
  }

  const fetchFollowings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/getfollowings/${userProfile._id}`, { withCredentials: true });


      if (res.data.success) {
        setFollowings(res.data.following);
        console.log('followings mil gaya ', followings);
        setOpenPop2(true);
      }

    }
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(setAuthUser(null));
      navigate('/login');
    }
  }



  const handleTabChange = (tab) => {
    setActiveTag(tab);
  }

  //  const getLikes = async (post) => {
  //         try {
  //             const res = await axios.get(`http://localhost:5000/api/v1/post/getlikes/${post._id}`, { withCredentials: true });
  //             if (res.data.success) {
  //                 setLikes(res.data.likes);
  //                 console.log('likes-->',likes);
  //                 setOpenLike(true);
  //             }
  //         }
  //         catch (error) {
  //             console.log(error);
  //         }
  //     }

  return (
    <div id='profile' className='flex max-w-4xl justify-center mx-auto pl-20'>
      <div className='flex flex-col gap-20'>

        <div className='grid grid-cols-2 p-8'>
          <section className='flex items-center justify-center'>
            <Avatar className=' w-20 h-20 sm:h-32 sm:w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto"></AvatarImage>
              <AvatarFallback> <img className='my-8 rounded-full h-32 w-32' src={image} alt="" /></AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2 '>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to='/account/edit'><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit Profile</Button></Link>

                      {/* <Button variant='secondary' className='hover:bg-gray-200 h-8'>View Archieve</Button> */}
                      {/* <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button> */}
                    </>
                  ) :
                    (
                      isFollowing ? (
                        <>
                          <Button onClick={followorUnFollow} variant='secondary' className='h-8'>Unfollow</Button>
                          <Button variant='secondary' className=' h-8'>Message</Button>
                        </>

                      ) : (

                        <Button onClick={followorUnFollow} className=' rounded-xl bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                      )

                    )
                }

              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts?.length}</span> posts</p>
                <Popover open={openpop} onOpenChange={(open) => setOpenPop(open)}>
                  {/* Trigger Button */}
                  <PopoverTrigger asChild>
                    <p onClick={fetchFollowers} className='cursor-pointer'><span className='font-semibold'>{userProfile?.followers?.length}</span> followers</p>
                  </PopoverTrigger>

                  {/* Popover Content */}
                  <PopoverContent className="w-64">
                    <p className="text-lg font-bold mb-2">Followers</p>
                    <ul className="space-y-2">
                      {followers.length > 0 && followers.map((user) => (
                        <li key={user._id} className="flex items-center space-x-3">
                          <Avatar className='h-8 w-8 rounded-full'>
                            <AvatarImage src={user.profilePicture} alt="profilephoto"></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          {/* <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full" /> */}
                          <p>{user.username}</p>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
                {/* <p><span className='font-semibold'>{userProfile?.followers?.length}</span> followers</p> */}
                <Popover open={openpop2} onOpenChange={(open) => setOpenPop2(open)}>

                  <PopoverTrigger asChild>
                    <p onClick={fetchFollowings} className='cursor-pointer'><span className='font-semibold'>{userProfile?.following?.length}</span> following</p>
                  </PopoverTrigger>


                  <PopoverContent className="w-64">
                    <p className="text-lg font-bold mb-2">Following</p>

                    <ul className="space-y-2">
                      {followings.length > 0 && followings?.map((user) => (
                        <li key={user._id} className="flex items-center space-x-3">
                          <Avatar className='h-8 w-8 rounded-full'>
                            <AvatarImage src={user.profilePicture} alt="profilephoto"></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          {/* <img src={ele.profilePicture} alt={ele.username} className="w-8 h-8 rounded-full" /> */}
                          <p>{user.username}</p>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
                {/* <p><span className='font-semibold'>{userProfile?.following?.length}</span> following</p> */}

              </div>
              <div className='flex flex-col gap-1'>
                <Badge className='w-fit' variant='secondary' ><AtSign /><span className='pl-1'>{userProfile?.username}</span></Badge>
                <span>{userProfile?.bio || 'bio here ...'}</span>
                {/* <span>Learn code with ViveK kushwaha</span>
                <span>Turing code into fun</span>
                <span>DM for collaboration</span> */}
              </div>

            </div>
          </section>

        </div>

        <div className='border-t border-t-gray-200 p-8 ' >
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab == 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab == 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            {
              /* 

              <span className={`py-3 cursor-pointer ${activeTab == 'reels' ? 'font-bold' : ''}`} onClick={() => handleTabChange('reels')}>
                REELS
              </span>
              <span className={`py-3 cursor-pointer ${activeTab == 'tags' ? 'font-bold' : ''}`} onClick={() => handleTabChange('tags')}>
                TAGS
              </span>
              
              */
            }

          </div>

          <div className='grid sm:grid-cols-3 grid-cols-1 gap-1 '>
            {
              displayedPost?.map((post) => <ProfilePost key={post._id} post={post} user={user}></ProfilePost>)

            }
          </div>

        </div>
      </div>
      {/* <CommentDialog open={open} setOpen={setOpen}></CommentDialog> */}

    </div>
  )
}

export default Profile
