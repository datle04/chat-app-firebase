import React, { useEffect, useState } from 'react'
import { searchUserByUsername } from '../services/searchService'
import { useDispatch, useSelector } from 'react-redux'
import { FiUserPlus } from "react-icons/fi";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { listenToFriendRequests, sendRequest } from '../redux/friendSlice';
import toast from 'react-hot-toast';
import { auth } from '../firebase/config';
import { useSleep } from '../hooks/useSleep';

const SearchResults = ({ search, selectedUser, setSelectedUser}) => {
    const authUser = useSelector(state => state.auth.user);
    const [searchResult, setSearchResult] = useState([])
    const sleep = useSleep();
    const dispatch = useDispatch();
    const friendRequestsSent = useSelector(state => state.friend.friendRequestsSent); 

    useEffect(() => {
        const fetchSearch = async () => {
            if (search.length > 0) {
                await sleep(300);
                const result = await searchUserByUsername(search);
                setSearchResult(result.filter((item => item.username !== authUser.username)));
            }
        };
        fetchSearch();
        
    },[authUser.username, search])

    useEffect(() => {
        console.log("Friend requests sent: ", friendRequestsSent);
        
    },[friendRequestsSent])

    useEffect(() => {
        if (!authUser?.uid) return;
    
        console.log("Setting up listener...");
        const unsubscribe = listenToFriendRequests(authUser.uid);
    
        return () => {
            console.log("Cleaning up listener...");
            if (typeof unsubscribe === "function") {
                unsubscribe(); // cleanup nếu cần
            }
        }
    }, [authUser, dispatch]);

    const addFriend = async (currentUser, targetUser) => {
        try {
            await dispatch(sendRequest({ currentUserId: currentUser.uid, targetUserId: targetUser.uid, authUser: authUser })).unwrap();
            toast.success("Friend request sent successfully"); 
            
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }

  return (   
    <div className='w-full absolute h-screen top-14 bottom-14 flex flex-col items-center z-10 bg-white overflow-y-scroll'>
        {
            searchResult.length !== 0 ? (
                searchResult.map((item, index) => (
                    <div
                        key={item.uid}
                        onClick={() => setSelectedUser(item)}
                        className='
                            w-full flex items-center gap-5 px-4 py-2 border border-slate-100
                    '>
                        <div className='flex items-center gap-2'>
                            <img src={item.avatar} alt="Avatar" className='w-12 h-12 rounded-full object-cover object-center' />
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold flex items-center gap-2'>
                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                {item.username}
                            </h3>
                        </div>
                        <div className='
                            flex w-5 h-5 justify-center items-center ml-auto rounded-full text-slate-600 cursor-pointer hover:bg-slate-200 transition-all duration-200 ease-in-out
                            
                        '>
                       {
                            friendRequestsSent?.some(req => req.targetUserId === item.uid) ? (
                                <BsFillPersonCheckFill className='w-5 h-5 text-lg' />
                            ) : item.friends.includes(authUser.uid) ? (
                                <LiaUserFriendsSolid className='w-5 h-5 text-lg' />
                            ) : (
                                <FiUserPlus
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addFriend(authUser, item);
                                    }}
                                    className='w-5 h-5 text-lg cursor-pointer hover:scale-110 transition'
                                />
                            )
                        }
                        </div>
                    </div>
                ))
            )    
            :
            (
                <div className='w-full h-full flex justify-center items-center'>
                    <h3 className='mb-30 text-lg font-semibold text-gray-500'>No user found</h3>
                </div>
            )       
        }
    </div>
  )
}

export default SearchResults
