import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './slices/socketSlice'
import { setOnlineUsers } from './slices/chatSlice'
import { setLikeNotification} from './slices/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
import { setPosts } from './slices/postSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { setAuthUser } from './slices/authSlice'



const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout></MainLayout></ProtectedRoutes> ,
    children: [
      {
        path: '/',
        element:<Home></Home>
      },
      {
        path: '/profile/:id',
        element:<Profile></Profile>
      },
      {
        path: "/account/edit",
        element:<EditProfile></EditProfile>
      },
      {
        path: "/chat",
        element:<ChatPage></ChatPage>
      }
    ]
  },
  {
    path: "/login",
    element:<Login></Login>
  },
  {
    path: "/signup",
    element:<Signup></Signup>
  }
])


function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  

  useEffect(() => {
    
    if (user) {
      const socketio = io(`${import.meta.env.VITE_BASE_URL}`, {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));


      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));

      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      // io.emit('newComment', posts);
      socketio.on('newComment', (posts) => {
        dispatch(setPosts(posts));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }

    } else if(socket){
      socket?.close();
      dispatch(setSocket(null));
     }
  },[user,dispatch])
   
  return (
    <>
     <RouterProvider router={browserRouter}></RouterProvider>
    </>
  )
}

export default App
