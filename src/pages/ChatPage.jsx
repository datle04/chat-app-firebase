import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../firebase/config'
import ConversationList from '../components/ConversationList'
import ChatScreen from '../components/ChatScreen'
import { useNavigate } from 'react-router-dom'
import { setMessages } from '../redux/messageSlice'

const ChatPage = () => {

    const authUser = useSelector(state => state.auth);  
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const chats = useSelector(state => state.chat.chats)
    const messages = useSelector(state => state.message.messages)
    const [search, setSearch] = useState("")
    const dispatch = useDispatch();

    useEffect(() => {
      if (selectedUser === null) {
        setMessages([]);
      }
    },[selectedUser])

    useEffect(() => { 
        if(!authUser.user){
          navigate("/login")
        }
    },[authUser])


  return (
    <div>
      {
        selectedUser ? <ChatScreen selectedUser={selectedUser} setSelectedUser={setSelectedUser}/> 
        :
        <ConversationList 
          selectedUser={selectedUser} 
          setSelectedUser={setSelectedUser}
          search={search}
          setSearch={setSearch}
        />
      }
    </div>
  )
}

export default ChatPage
