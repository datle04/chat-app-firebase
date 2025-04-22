import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { auth } from '../firebase/config'
import ConversationList from '../components/ConversationList'
import ChatScreen from '../components/ChatScreen'
import { useNavigate } from 'react-router-dom'

const ChatPage = () => {

    const authUser = useSelector(state => state.auth);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const chats = useSelector(state => state.chat.chats)

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
        <ConversationList selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      }
      
    </div>
  )
}

export default ChatPage
