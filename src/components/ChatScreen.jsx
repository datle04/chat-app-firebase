import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, listenMessagesRealtime, sendMessage } from '../redux/messageSlice';
import { createChat, getChat } from '../redux/chatSlice';
import { serverTimestamp } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ChatScreen = ({ selectedUser, setSelectedUser}) => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const [text, setText] = useState('');
  const messages = useSelector(state => state.message.messages);
  const loading = useSelector(state => state.message.loading);
  const [chatId, setChatId] = useState('');
  const scrollRef = useRef(null)

  useEffect(() => {
    const getExistingChat = async () => {
      try {
        // Gọi dịch vụ để lấy hoặc tạo chat
        const result = await dispatch(getChat({ members: [authUser, selectedUser] }));
  
        // Debug: In kết quả trả về để xem structure của result
        console.log("Result from getOrCreateChat:", result);
  
        // Kiểm tra nếu payload có chứa chatId
        const chatId = result.payload;
  
        // Debug: Kiểm tra chatId
        console.log("Chat ID:", chatId);
  
        if (chatId) {
          // Lưu chatId và tải tin nhắn
          setChatId(chatId);
          await dispatch(fetchMessages(chatId));
          dispatch(listenMessagesRealtime(chatId));
        }
        console.log(messages);
        
      } catch (error) {
        console.log("Error while getting or creating chat:", error);
      }
    };
  
    getExistingChat();
  }, [authUser, selectedUser, dispatch]);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = dispatch(listenMessagesRealtime(chatId));
      return () => unsubscribe();
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    // Bắt đầu lắng nghe tin nhắn realtime
    const unsubscribe = dispatch(listenMessagesRealtime(chatId));

    // Cleanup
    return () => unsubscribe();
  }, [chatId, dispatch]);

  useEffect(() => {
    // Cuộn xuống khi có tin nhắn mới
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if(chatId === "") {
      const result = await dispatch(createChat({ members: [authUser, selectedUser] }));
      const newChatId = result.payload; // Chat ID sau khi tạo mới
      setChatId(newChatId);
      // await dispatch(fetchMessages(newChatId)); // Tải tin nhắn cho chat mới
    }
  
    if (!text.trim() || !chatId) return; // check chatId trước
  
    setText('');
  
    try {
      const message = {
        chatId,
        senderId: authUser.uid,
        content: text.trim(),
        attachment: "",
      };
      await dispatch(sendMessage(message));
    } catch (error) {
      console.log("Gửi tin nhắn lỗi:", error);
    }
  };
  
  

  const convertTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  return (
    <div className='w-full h-screen flex flex-col bg-slate-100'>

      {/* Header */}
      <div className='h-14 flex items-center gap-3 border-b border-slate-300 bg-white px-4'>
        <IoIosArrowBack onClick={() => setSelectedUser(null)} className='text-xl cursor-pointer' />
        <img src={selectedUser.avatar} alt="Avatar" className='w-10 h-10 rounded-full object-cover' />
        <h3 className='text-lg font-semibold'>{selectedUser.username}</h3>
      </div>

      {/* Chat Section */}
      <div className='h-full flex flex-col gap-3 px-2 py-2 overflow-y-auto bg-white'>
        {loading ? (
          // Hiển thị skeleton tin nhắn (giả lập 5 cái)
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className={`w-fit ${index % 2 === 0 ? 'self-start' : 'self-end'}`}>
              <Skeleton
                count={1}
                width={Math.random() * (220 - 100) + 100}
                height={32}
                borderRadius={10}
              />
            </div>
          ))
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`w-fit flex flex-col gap-1 ${message.senderId === authUser.uid ? 'self-end' : 'self-start'}`}>
              <div className={`max-w-[55vw] px-2 py-2 rounded-lg relative ${message.senderId === authUser.uid ? 'bg-sky-500 text-white' : 'bg-slate-200'}`}>
                <p className='pr-9 pb-1 text-sm'>{message.content}</p>
                <span className={`absolute bottom-1 right-2 text-[11px] ${message.senderId === authUser.uid ? 'text-slate-200' : 'text-slate-400'}`}>
                  {convertTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className='h-14 flex items-center border-t border-slate-300 bg-white'>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 h-full px-4 outline-none'
        />
        <button
          onClick={handleSendMessage}
          disabled={!text.trim()}
          className='h-full px-4 text-white bg-sky-500 text-xl'
        >
          <IoIosSend />
        </button>
      </div>
    </div>
  );
  
}

export default ChatScreen

