import React from 'react'
import { AiFillMessage } from "react-icons/ai";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  return (
    <div 
      className='
        w-full h-14 flex justify-around items-center fixed bottom-0 left-0 right-0 z-10 bg-white border border-slate-300
    '>
      <div 
        className='
          flex flex-col justify-center items-center text-sky-500 text-[12px] font-semibold cursor-pointer
      '>
        <AiFillMessage className='text-xl'/>
        Messages
      </div>
      <div 
        className='
          flex flex-col justify-center items-center text-slate-500 text-[12px] font-semibold cursor-pointer
      '>
        <LiaUserFriendsSolid  className='text-xl'/>
        Friends
      </div>
      <div 
        className='
          flex flex-col justify-center items-center text-slate-500 text-[12px] font-semibold cursor-pointer
      '>
        <CgProfile  className='text-xl'/>
        Profile
      </div>
    </div>
  )
}

export default Navbar
