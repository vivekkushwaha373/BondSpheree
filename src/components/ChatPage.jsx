import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setAuthUser, setSelectedUser } from '@/slices/authSlice';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import { Input } from 'postcss';
import Messages from './Messages';
import { setMessages } from '@/slices/chatSlice';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';



const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector((state) => state.auth);
    const { onlineUsers, messages } = useSelector((store) => store.chat);
    const navigate = useNavigate();
    const dispath = useDispatch();

    const sendMessageHandler = async (recieverId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/message/send/${recieverId}`,
                { textMessage },
                {
                    headers: {
                        'Content-Type': "application/json"
                    },
                    withCredentials: true
                }

            )

            if (res.data.success) {
                console.log(res.data.success + " hai ya nahi");
                dispath(setMessages([...messages, res.data.newMessage]));
                setTextMessage('');

            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        }
    }

    useEffect(() => {
        return () => {
            dispath(setSelectedUser(null));
        }
    }, []);

    return (
        <div className='flex ml-[5%] sm:ml-[20%] h-screen'>
            <section className=' md:w-1/4  my-8'>
                <h1 className='font-bold mb-4 px-3 text-all'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (

                                <div onClick={() => dispath(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture}></AvatarImage>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span>{suggestedUser?.username}</span>
                                        <span className={`text-xs ${isOnline ? 'text-green-600' : "text-red-600"} `}>{isOnline ? 'online' : "offline"}</span>
                                    </div>
                                </div>

                            )
                        })
                    }
                </div>
            </section>

            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' ></AvatarImage>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser}></Messages>
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type='text' className=' p-2 flex-1 mr-2 focus-visible:ring-transparent' placeholder='Messages' />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4'></MessageCircleCode>
                        <h1 className='font-md text-xl'>Your Message</h1>
                        <span>Send a message to start a chat</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage
