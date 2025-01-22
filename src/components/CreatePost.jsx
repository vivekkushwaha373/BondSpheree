import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import React, { useRef, useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/slices/postSlice'
import { setAuthUser } from '@/slices/authSlice'
import { useNavigate } from 'react-router-dom'


const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }
    const createPostHandler = async (e) => {


        const formData = new FormData();
        formData.append('caption', caption);
        if (imagePreview)
            formData.append('image', file);

        console.log(formData);
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/addpost`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

           

            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);

                setOpen(false);
            }
        }
        catch (error) {
            toast.error(error.message || "error" || error.message.data?.response);
            setOpen(false);
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
                <div className='flex gap-3 item-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="img"></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600 font-semibold text-xs'>Bio here...</span>
                    </div>
                </div>
                <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent" placeholder="Write a caption..."></Textarea>
                {
                    imagePreview && (
                        <div className='w-full h-64 flex items-center justify-center'>
                            <img src={imagePreview} alt="preview_image" className='object-cover h-full w-full rounded-md' />
                        </div>
                    )
                }
                <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#3993ce]">Select from computer</Button>
                {
                    imagePreview && (
                        loading ? (
                            <Button>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={createPostHandler} type="submit" className='w-full'>Post</Button>
                        )
                    )
                }
                {/* <Button>Post</Button> */}
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
