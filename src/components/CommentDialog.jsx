import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import React, { useEffect, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/slices/postSlice'
import { setAuthUser, setUserProfile } from '@/slices/authSlice'
import image from '../assets/favicon.jpg'


const CommentDialog = ({ open, setOpen }) => {

    const [text, setText] = useState("");
    const { user } = useSelector(store => store.auth);
    const { selectedPost, posts } = useSelector(store => store.post);
    const dispatch = useDispatch();
    const [comment, setComment] = useState(selectedPost?.comments);
    const navigate = useNavigate();
    

    useEffect(() => {
        setComment(selectedPost?.comments);
    },[selectedPost?.comments])
    
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        }
        else {
            setText("");
        }
    }
    let isFollowing = user?.following.includes(selectedPost?.author?._id);
    const followorUnFollow = async () => {
        try {
            //first I will follow them and then Will unfollow the,
            const id = selectedPost?.author?._id;
            console.log('id ', id);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/followorunfollow/${id}`, {}, { withCredentials: true });



            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                isFollowing = user?.following?.includes(selectedPost?.author?._id);
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

    // const sendMessageHandler = async (e) => {
    //     alert(text);
    // }

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/${selectedPost._id}/comment`, { text }, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            });



            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="md:max-w-5xl w-[80%] p-0 flex flex-col" >
                <div className='flex flex-1'>
                    <div className='sm:w-1/2 w-0'>
                        <img src={selectedPost?.image}
                            alt="post_img"
                            className='w-full h-full object-cover  rounded-l-lg'

                        />

                    </div>
                    <div className='sm:w-1/2 w-full flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>

                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture}></AvatarImage>
                                        <AvatarFallback><img className='my-8 rounded-full' src={image} alt="" /></AvatarFallback>
                                    </Avatar>

                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                                    {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger aschild>
                                    <MoreHorizontal></MoreHorizontal>
                                </DialogTrigger>
                                <DialogContent className='flex flex-col items-center text-sm text-center'>
                                    <div className='cursor-pointer sm:w-full w-[50%] p-2 text-[#ED4956] font-bold'>
                                        {
                                            selectedPost?.author?._id != user?._id && <p type='button' onClick={followorUnFollow}>{isFollowing ? 'unfollow' : 'follow'}</p>
                                        }
                                    </div>
                                    <div className='cursor-pointer w-full'>
                                        Add to favorites
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment?.map((comment) => <Comment key={comment._id} comment={comment}></Comment>)
                            }

                        </div>
                        <div className='p-4 w-full'>
                            <div className='flex items-center gap-2'>
                                <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a Comment...' className='w-full outline-none border border-gray-300 p-2 rounded' />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline' >Send</Button>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
