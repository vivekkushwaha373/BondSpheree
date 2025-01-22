import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/slices/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const {user} = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    function changeEventHandler(e) {
        setInput((input) => {
            return {
                ...input,
                [e.target.name]: e.target.value
            }

        })
    }
    async function signupHandler(e) {
        e.preventDefault();
        console.log(input);

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/login`, input, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                
                dispatch(setAuthUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
                setInput({

                    email: "",
                    password: ""
                })
            }

        }
        catch (error) {
            
            toast.error(error.response.data.message);
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (user) {
            navigate('/');   
        }
    },[])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} action="" className='shadow-lg flex flex-col gap-5 p-8 '>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl mb-2'>LOGO</h1>
                    <p>Login to see photos and videos from your friend</p>
                </div>
                <div className=''>
                    {/* <label htmlFor="username" classname='p-2 font-medium'>Username</label>
                    <br />
                    <input type="text" id='username' name='username' value={input.username} onChange={changeEventHandler} className='py-1 my-2 focus-visible:ring-transparent w-full' /> */}
                    <label htmlFor="email" className='p-2 font-medium'>Email</label>
                    <br />
                    <input type="email" id='email' name='email' value={input.email} onChange={changeEventHandler} className='py-1 my-2 focus-visible:ring-transparent w-full' />
                    <label htmlFor="password" className='p-2 font-medium'>Password</label>
                    <br />
                    <input type="password" id='password' name='password' value={input.password} onChange={changeEventHandler} className='py-1 my-2 focus-visible:ring-transparent w-full' />
                    {
                        loading ? (
                            <Button type='submit' className=' rounded-xl w-full mt-2'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                                Please wait
                            </Button>

                        ) : (
                            <Button type='submit' className=' rounded-xl w-full mt-2'>
                                LogIn
                            </Button>

                        )
                    }
                    <div className='text-center'>Doesn't have an account? <Link className='text-blue-600' to='/signup'>Signup</Link></div>
                </div>
            </form>
        </div>
    )
}

export default Login
