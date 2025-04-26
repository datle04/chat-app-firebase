import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addMemberToChat, createChatService, getChatService, getUserChats } from "../services/chatService";

// Lấy danh sách cuộc trò chuyện
export const fetchChats = createAsyncThunk("chats/fetchChats", async (userId, { rejectWithValue }) => {
    try {
      const data =  await getUserChats(userId);
      // console.log(data);
      
      return data;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  // Tạo cuộc trò chuyện mới (chat nhóm hoặc chat riêng)
  export const createChat = createAsyncThunk("chats/createChat", async ({ members, name, groupAvatar }, { rejectWithValue }) => {
    try {
      let chat = await createChatService(members, name, groupAvatar);
      return chat;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  });  

  export const getChat = createAsyncThunk("chats/getChat", async ({ members }, { rejectWithValue }) => {
    try {
      const chat = await getChatService(members);
      return chat;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  // Thêm thành viên vào nhóm chat
  export const addMember = createAsyncThunk("chats/addMembers", async ({ chatId, members }, { rejectWithValue }) => {
    try {
      return await addMemberToChat(chatId, members);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  const chatSlice = createSlice({
    name: "chats",
    initialState: { chats: [], loading: false, error: null },
    reducers: {
      setChats: (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchChats.pending, (state) => { state.loading = true; })
        .addCase(fetchChats.fulfilled, (state, action) => {
          state.loading = false;
          state.chats = action.payload.map((chat) => {         
            return chat
          });
        })
        .addCase(fetchChats.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(getChat.pending, (state) => { state.loading = true; })
        .addCase(getChat.fulfilled, (state, action) => {
          state.loading = false;
          const chatId = action.payload;  // nếu không có chat thì trả về null
          
          if (chatId) { // Nếu có cuộc trò chuyện
            const existing = state.chats.find(c => c.id === chatId);
            if (!existing) {           
              state.chats.push({ id: chatId });
            }
          } else {
            // Nếu không có chat, không cần làm gì thêm
            console.log("Chưa có cuộc trò chuyện. Chờ người dùng gửi tin nhắn.");
          }
        })
        .addCase(getChat.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createChat.pending, (state) => { 
          state.loading = true; 
        })
        .addCase(createChat.fulfilled, (state, action) => {
          state.loading = false;
          const chat = action.payload;
          
          const existing = state.chats.find(c => c.id === chat.id);
          if (!existing) {
            state.chats.push(chat);
          }
        })
        .addCase(createChat.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(addMember.pending, (state) => { state.loading = true; })
        .addCase(addMember.fulfilled, (state, action) => {
          state.loading = false;
          const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.chatId);
          if (chatIndex !== -1) {
            // Thêm thành viên vào mảng members của chat
            state.chats[chatIndex] = { ...state.chats[chatIndex], members: action.payload.members };
          }
        })
        .addCase(addMember.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { setChats } = chatSlice.actions;
  export default chatSlice.reducer;