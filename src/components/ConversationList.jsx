import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChats, setChats } from '../redux/chatSlice'
import SearchBar from './SearchBar'
import Navbar from './Navbar'
import SearchResults from './SearchResults'
import { auth } from '../firebase/config'
import { listenToUserChats } from '../services/chatService'

const ConversationList = ({ search, setSearch, selectedUser, setSelectedUser }) => {

    const dispatch = useDispatch()
    const authUser = useSelector(state => state.auth)
    const chats = useSelector(state => state.chat.chats)
    const loading = useSelector(state => state.chat.loading)
    const [usersNotSelf, setUsersNotSelf] = useState({})

    useEffect(() => {   
        if (authUser.user) {
            console.log(authUser.user.uid);      
            dispatch(fetchChats(authUser.user.uid))
        }    
    },[authUser, dispatch])

    useEffect(() => {
        let unsubscribe;
        if (authUser.user) {
            unsubscribe = listenToUserChats(authUser.user.uid, (updatedChats) => {
                // Sắp xếp trước khi lưu
                const sortedChats = updatedChats.sort((a, b) => {
                    const timeA = a.updatedAt?.toMillis?.() || 0;
                    const timeB = b.updatedAt?.toMillis?.() || 0;
                    return timeB - timeA;
                });
    
                dispatch(setChats(sortedChats));
            });
        }
    
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [authUser.user, dispatch]);

    useEffect(() => {
        // Khi `chats` thay đổi, cần tính toán lại `usersNotSelf`
        if (chats) {
            const users = chats.reduce((acc, chat) => {
                if (chat.members) {
                    const user = chat.members.find(member => member.uid !== authUser.user.uid)
                    if (user) {
                        acc[chat.id] = user // Lưu user trong một object với key là ID cuộc trò chuyện
                    }
                }
                return acc;
            }, {})
            setUsersNotSelf(users)
        }
    }, [chats, authUser.user])

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>

        {/* Search Bar*/}
        <SearchBar search={search} setSearch={setSearch} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        
        <div className='w-full mt-14 flex flex-col justify-center items-center overflow-y-scroll'>
        {[...chats]
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((chat, index) => {
                const user = usersNotSelf[chat.id];

                return (
                    <div
                        key={index}
                        onClick={() => setSelectedUser(user)}
                        className='w-full flex items-center start gap-5 px-4 py-2 border border-slate-100'
                    >
                        <div className='flex items-center gap-2'>
                            <img
                                src={user ? user.avatar : chat.groupAvatar}
                                alt="Avatar"
                                className='w-12 h-12 rounded-full'
                            />
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold flex items-center gap-2'>
                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                {user?.username}
                            </h3>
                            <p className='px-2 text-gray-500 text-ellipsis line-clamp-1'>
                                {chat.lastMessage?.content || "No messages yet"}
                            </p>
                        </div>
                    </div>
                );
        })}
        </div>
        
        {/* Nav bar */}
        <Navbar/>
    </div>
  )
}

export default ConversationList
