import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/slices/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/slices/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { deleteLikeNotification } from '@/slices/rtnSlice'
import { GiHamburgerMenu } from "react-icons/gi";
import image from '../assets/favicon.jpg'

const LeftSidebar = () => {

    
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();

    const fetchAllPost = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/all`, { withCredentials: true });
            


            if (res.data.success) {
                dispatch(setPosts(res.data.posts));
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        }
    }

    const sidebarItems = [
        { icon: <Home></Home>, text: "Home" },
        // { icon: <Search></Search>, text: "Search" },
        // { icon: <TrendingUp></TrendingUp>, text: "Explore" },
        { icon: <MessageCircle></MessageCircle>, text: "Messages" },
        { icon: <Heart></Heart>, text: "Notification" },
        { icon: <PlusSquare></PlusSquare>, text: "Create" },
        {
            icon: <Avatar className='w-8 h-8'>
                <AvatarImage src={user?.profilePicture || image} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>, text: "Profile"
        },
        { icon: <LogOut></LogOut>, text: "LogOut" },

    ]


    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate('/login');
                toast.success(res.data.message);
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }


    const sidebarHandler = async (textType) => {
        if (textType == "LogOut")
            logoutHandler();
        else if (textType == 'Create') {
            setOpen(true);
        }
        else if (textType == 'Profile') {
            navigate(`/profile/${user?._id}`);
        }
        else if (textType == 'Home') {
            await fetchAllPost();
            navigate("/");
        }
        else if (textType == 'Messages') {
            navigate('/chat');
        }
    }


    return (


        <div className='md:fixed md:top-0 md:z-10 md:left-0 px-4 md:border-r w-[16%] border-gray-300 h-screen'>
            <div className='flex flex-col'>
                <img className='my-8 rounded-full h-16 w-16' src={image} alt="" />

                <div>

                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div key={index} onClick={() => { sidebarHandler(item.text) }} className='flex items-center gap-3 relative hover:bg-gray-100 rounded-lg p-3 my-3 cursor-pointer'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                    {
                                        item.text === 'Notification' && likeNotification.length > 0 && (
                                            <Popover onOpenChange={(isOpen) => {
                                                if (!isOpen) dispatch(deleteLikeNotification());
                                            }} >
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className='rounded-full bg-red-600 hover:bg-red-600 h-5 w-5 absolute bottom-6 left-6'>{likeNotification.length}</Button>

                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification, i) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex gap-2 items-center my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture}>

                                                                                </AvatarImage>
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username} </span>{notification.message}</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen}></CreatePost>
        </div>


    )
}

export default LeftSidebar
