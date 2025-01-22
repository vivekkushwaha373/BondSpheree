import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import image from '../assets/favicon.jpg'
const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
              <Avatar>
                  <AvatarImage src={comment?.author?.profilePicture}></AvatarImage>
                  <AvatarFallback><img className='my-8 rounded-full' src={image} alt="" /></AvatarFallback>
              </Avatar>            
              <h1 className='font-bold text-sm'>
                  {comment?.author?.username} <span className='font-normal pl-1'>{comment?.text}</span> 
              </h1>
       </div>
    </div>
  )
}

export default Comment
