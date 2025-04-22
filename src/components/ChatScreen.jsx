import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, listenMessagesRealtime, sendMessage } from '../redux/messageSlice';
import { getOrCreateChat } from '../redux/chatSlice';
import { serverTimestamp } from 'firebase/firestore';

const ChatScreen = ({ selectedUser, setSelectedUser}) => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const [text, setText] = useState('');
  const messages = useSelector(state => state.message.messages);
  const [chatId, setChatId] = useState('');

  useEffect(() => {
    const getMessages = async () => {     
      const result = await dispatch(getOrCreateChat({
        members: [authUser, selectedUser]
      }));
      
      setChatId(result.payload);
      await dispatch(fetchMessages(result.payload));
    }
    getMessages();    
  },[])

  useEffect(() => {
    // Bắt đầu lắng nghe tin nhắn realtime
    const unsubscribe = dispatch(listenMessagesRealtime(chatId));

    // Cleanup: hủy lắng nghe khi component unmount
    return () => unsubscribe();
  }, [chatId, dispatch]);

  const handleSendMessage = async () => {
    console.log("Function called with content: ", text);
    
    if (text.length === 0) return;
    try {
      const message = {
        chatId,
        senderId: authUser.uid,
        content: text,
        attachment: "",
        timestamp: serverTimestamp(),
      };
      await dispatch(sendMessage(message));
      setText('');
    } catch (error) {
      console.log(error);
    }
    console.log(messages);
    
  }

  return (
    <div 
      className='
        w-full h-screen flex flex-col justify-center bg-slate-100  
    '>
      <div className='w-full h-14 flex justify-start items-center gap-3 border border-b-slate-300 bg-white p-4'>
        <IoIosArrowBack 
          onClick={() => setSelectedUser(null)}
          className='text-xl font-bold cursor-pointer'
        />
        <div className='flex items-center gap-3'>
          <img src={selectedUser.avatar} alt="Avatar" className='w-10 h-10 rounded-full object-cover object-center' />
          <h3 className='text-lg font-semibold flex items-center gap-2'>
            {selectedUser.username}
          </h3>
        </div>
      </div>

      {/* Chat Section */}
      <div className='w-full h-full flex flex-col justify-center items-center bg-white'>

      </div>

      {/* Input Section */}
      <div className='w-full h-14 flex justify-center items-center gap-3 border border-t-slate-300 bg-white '>
        <input 
          type="text" 
          placeholder='Type a message...'
          className='w-full h-full px-5 outline-0 text-md font-semibold'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          disabled={text.length === 0}
          className='px-4 h-full bg-sky-500 text-white text-xl
        '>
          <IoIosSend />
        </button>
      </div>
    </div>
  )
}

export default ChatScreen

