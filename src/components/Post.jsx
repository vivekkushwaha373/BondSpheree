import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/slices/postSlice'
import { Badge } from './ui/badge'
import { setAuthUser } from '@/slices/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import image from '../assets/favicon.jpg'


const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { posts } = useSelector((state) => state.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const [openpop, setOpenPop] = useState(false);
    const [likes, setLikes] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }
    
   
    useEffect(() => {
        setComment(post.comments);
    }, [post.comments]);

    const followorUnFollow = async () => {
        try {

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/followorunfollow/${post?.author?._id}`, {}, { withCredentials: true });



            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                // isFollowing = user.following.includes(userProfile?._id);
                // dispatch(setUserProfile(res.data.userProfile));
            }


        }
        catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        }
    }


    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/${post._id}/${action}`, { withCredentials: true });



            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);
                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
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

    const commentHandler = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            });



            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }

        } catch (error) {
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        }
    }

    // const commentHandler1 = async () => {
    //     dispatch(setSelectedPost(post));

    //     try {
    //         const res = await axios.post(`http://localhost:5000/api/v1/post/${post._id}/comment`, { text }, {
    //             headers: {
    //                 'Content-Type': "application/json"
    //             },
    //             withCredentials: true
    //         });



    //         if (res.data.success) {
    //             const updatedCommentData = [...comment, res.data.comment];
    //             setComment(updatedCommentData);

    //             const updatedPostData = posts.map(p =>
    //                 p._id === post._id ? { ...p, comments: updatedCommentData } : p
    //             );
    //             dispatch(setPosts(updatedPostData));
    //             toast.success(res.data.message);
    //             setText("");
    //         }

    //     } catch (error) {
    //         toast.error(error.response.data.message);
    //         dispatch(setAuthUser(null));
    //         navigate('/login');
    //     }
    // }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/post/delete/${post._id}`, { withCredentials: true });



            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id)
                dispatch(setPosts(updatedPostData));
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

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });


            if (res.data.success) {
                toast.success(res.data.message);
            }

        }
        catch (error) {
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        }
    }

    const getLikes = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/getlikes/${post._id}`, { withCredentials: true });


            if (res.data.success) {
                setLikes(res.data.likes);
                console.log('likes-->', likes);
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

    return (
        <div className='my-8 w-full sm:max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>

                    <Link to={`/profile/${post?.author?._id}`}>
                        <Avatar>
                            <AvatarImage src={post?.author?.profilePicture} alt="profilephoto"></AvatarImage>
                            <AvatarFallback><img className='my-8 rounded-full ' src={image} alt="" /></AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className='flex items-center gap-3'>
                        <h1>{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
                    </div>

                </div>
                <Dialog >
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer'></MoreHorizontal>
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        {
                            user?.following.includes(post?.author?._id) ? (<Button onClick={followorUnFollow} variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>Unfollow</Button>) : (<Button onClick={followorUnFollow} variant='ghost' className='cursor-pointer w-fit h-fit text-[#ED4956] font-bold'>{user?._id !== post?.author?._id ? ('follow') : (null)}</Button>)

                        }
                        {/* post?.author?._id !== user?._id && <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>Unfollow</Button> */}
                        <Button onClick={bookmarkHandler} variant='ghost' className='cursor-pointer w-fit'>Add to favorites</Button>
                        {
                            user && user?._id === post?.author?._id && <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit'>Delete</Button>
                        }

                    </DialogContent>
                </Dialog>

            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img" />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'22px'} className='text-red-600' ></FaHeart> :
                            <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600'></FaRegHeart>
                    }

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600'></MessageCircle>
                    <Send className='cursor-pointer hover:text-gray-600'></Send>
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600'></Bookmark>
            </div>
            <Popover open={openpop} onOpenChange={(open) => setOpenPop(open)}>
                {/* Trigger Button */}
                <PopoverTrigger asChild>
                    <span onClick={getLikes} className='font-medium block mb-2 cursor-pointer'>{postLike} likes</span>
                </PopoverTrigger>

                {/* Popover Content */}
                <PopoverContent className="w-64">
                    <p className="text-lg font-bold mb-2">Likes</p>
                    <ul className="space-y-2">
                        {
                            likes.length > 0 && likes.map((user) => (
                                <li key={user._id} className="flex items-center space-x-3">
                                    <Avatar className='h-8 w-8 rounded-full'>
                                        <AvatarImage src={user.profilePicture} alt="profilephoto"></AvatarImage>
                                        <AvatarFallback><img className='my-8 rounded-full' src={image} alt="" /></AvatarFallback>
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
            {/* <span className='font-medium block mb-2'>{postLike} likes</span> */}
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment.length > 0 && (
                    <span onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer text-sm text-gray-400'>View all {post?.comments?.length} Comments</span>
                )
            }

            <CommentDialog open={open} setOpen={setOpen}></CommentDialog>
            <div className='flex items-center justify-between'>
                <input type='text' placeholder='Add a Comment'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADE8] cursor-pointer'>Post</span>
                }

            </div>
        </div>
    )
}

export default Post
