import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const NotificationScreen = () => {

    const authUser = useSelector(state => state.auth.user)
    useEffect(()=> {
        console.log(authUser);
        
    },[])
    
  return (
    <div 
        className='
            absolute z-20 top-[75%] right-[7%] w-[70%] h-[60vh] flex flex-col border border-slate-300 bg-white shadow-md overflow-y-scroll
    '>
        <h2 className='flex items-center'>
            <span className='px-2 py-2 text-[16px] font-bold text-black'>Friend Requests</span>
        </h2>
        {
            authUser.friendRequests.length > 0 ? (
                <div className='w-full h-full flex flex-col '>
                   {
                    authUser.friendRequests.map(item => (
                        <div 
                            key={item.senderId}
                            className='
                                w-full flex items-center gap-1 px-2 py-2 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all duration-200 ease-in-out
                            '
                        >
                            <div className='flex flex-3 items-center gap-2'>
                                <img src={item.senderAvatar} alt="Avatar" className='w-12 h-12 rounded-full object-cover object-center' />
                            </div>
                            <div className='w-full flex flex-7 flex-col gap-1'>
                                <h3 className='text-lg text-black font-semibold flex items-center'>
                                    {item.senderUsername}
                                </h3>
                                <div className='flex items-center gap-2'>
                                    <button
                                        className='
                                            w-[50%] py-1 flex justify-center items-center rounded bg-sky-600 text-white font-semibold cursor-pointer hover:bg-sky-500 transition-all
                                    '>
                                        <span className='text-sm'>
                                            Accept
                                        </span>
                                    </button>
                                    <button
                                        className='
                                            w-[50%] py-1 flex justify-center items-center rounded bg-slate-500 text-white font-semibold cursor-pointer hover:bg-slate-400 transition-all
                                    '>
                                        <span className='text-sm'>
                                            Reject
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                   }
                </div>
            )
            :
            (
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                        <p className='text-slate-500 text-sm'>You have no notifications</p>
                    </div>
                </div> 
            )    
        }    
    </div>
  )
}

export default NotificationScreen
