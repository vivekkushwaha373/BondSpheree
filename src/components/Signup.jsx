import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';


const Signup = () => {
    const navigate = useNavigate(); 
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const { user } = useSelector(store => store.auth);
    
    const [loading, setLoading] = useState(false);
    function changeEventHandler(e) {
        setInput((input)=>{
            return {
                ...input,
                [e.target.name]:e.target.value
           }
            
        })
    }
    async function signupHandler(e) {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/register`, input, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            });

            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }
           
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        finally{
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
                    <p>Signup to see photos and videos from your friend</p>
                </div>
                <div className=''>
                    <label htmlFor="username" classname='p-2 font-medium'>Username</label>
                    <br />
                    <input type="text" id='username' name='username' value={input.username} onChange={changeEventHandler} className='py-1 my-2 focus-visible:ring-transparent w-full' />
                    <label htmlFor="email" classname='p-2 font-medium'>Email</label>
                    <br />
                    <input type="email" id='email' name='email' value={input.email} onChange={changeEventHandler} className='py-1 my-2 focus-visible:ring-transparent w-full' />
                    <label htmlFor="password" classname='p-2 font-medium'>Password</label>
                    <br />
                    <input type="password" id='password' name='password' value={input.password} onChange={changeEventHandler} className='py-1 my-2 focus-visible:ring-transparent w-full' />
                    
                    {
                        loading ? (
                            <Button type='submit' className=' rounded-xl w-full mt-2'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                                Please wait
                            </Button>
                        
                        ): (
                                <Button type='submit' className=' rounded-xl w-full mt-2'>
                                    SignUp
                                </Button>
                                
                        )
                    }
                    <div className='text-center'>Aready have an account? <Link  className='text-blue-600' to='/login'>login</Link></div>
                </div>
            </form>
        </div>
    )
}

export default Signup
