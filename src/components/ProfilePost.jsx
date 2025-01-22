import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MessageCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSelectedPost } from '@/slices/postSlice';
import CommentDialog from './CommentDialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import axios from 'axios';
import { setAuthUser, setUserProfile } from '@/slices/authSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import image from '../assets/favicon.jpg'

const ProfilePost = ({ post, user }) => {

    const [likes, setLikes] = useState([]);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [openlike, setOpenLike] = useState(false);
    const navigate = useNavigate();


    const likeOrDislikeHandler = async () => {
        try {
            const action = post?.likes.includes(user?._id) ? 'dislike' : 'like';
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/${post?._id}/${action}`, { withCredentials: true });



            if (res.data.success) {

                dispatch(setUserProfile(res.data.postOwner));
                // displayedPost = activeTab == 'posts' ? userProfile?.posts : userProfile?.bookmarks;
                toast.success(res.data.message);
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        }
    }

    const getLikes = async (post) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/getlikes/${post._id}`, { withCredentials: true });


            if (res.data.success) {
                setLikes(res.data.likes);
                console.log('likes-->', likes);
                setOpenLike(true);
            }


        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            navigate('/login');
        }
    }


    return (
        <div className='relative group cursor-pointer'>
            <img src={post.image} alt="postImage" className='rounded-sm my-2 w-full aspect-square object-cover' />
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in'>
                <div className='flex items-center text-white space-x-4'>
                    <button className="flex items-center gap-2 hover:text-gray-300">

                        {
                            post.likes.includes(user?._id) ? <FaHeart onClick={() => likeOrDislikeHandler()} size={'22px'} className='text-red-600' ></FaHeart> :
                                <FaRegHeart onClick={() => likeOrDislikeHandler()} size={'22px'} className='cursor-pointer hover:text-gray-600'></FaRegHeart>
                        }
                    </button>
                    <Popover open={openlike} onOpenChange={(open) => setOpenLike(open)}>

                        <PopoverTrigger asChild>
                            <span onClick={() => getLikes(post)}>{post?.likes?.length}</span>
                        </PopoverTrigger>


                        <PopoverContent className="w-64">
                            <p className="text-lg font-bold mb-2">Likes</p>
                            <ul className="space-y-2">
                                {
                                    likes.length > 0 && likes.map((user) => (
                                        <li key={user._id} className="flex items-center space-x-3">
                                            <Avatar className='h-8 w-8 rounded-full'>
                                                <AvatarImage src={user.profilePicture} alt="profilephoto"></AvatarImage>
                                                <AvatarFallback > <img className='my-8 rounded-full h-8 w-8' src={image} alt="" /></AvatarFallback>
                                            </Avatar>
                                            {/* <img src={ele.profilePicture} alt={ele.username} className="w-8 h-8 rounded-full" /> */}
                                            <p>{user.username}</p>
                                        </li>
                                    )
                                    )
                                }
                            </ul>
                        </PopoverContent>
                    </Popover>
                    {/* <span>{post?.likes?.length}</span> */}

                    <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }} ></MessageCircle>
                        <span>{post?.comments?.length}</span>
                    </button>
                </div>
            </div>
            <CommentDialog open={open} setOpen={setOpen}></CommentDialog>
        </div>
    )
}

export default ProfilePost
