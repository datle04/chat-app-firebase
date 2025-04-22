import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addMemberToChat, getOrCreateChatService, getUserChats } from "../services/chatService";

// Lấy danh sách cuộc trò chuyện
export const fetchChats = createAsyncThunk("chats/fetchChats", async (userId, { rejectWithValue }) => {
    try {
      const data =  await getUserChats(userId);

      return data;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  // Tạo cuộc trò chuyện mới (chat nhóm hoặc chat riêng)
  export const getOrCreateChat = createAsyncThunk("chats/getOrCreateChat", async ({ members, name }, { rejectWithValue }) => {
    try {
      console.log(members);
      
      return await getOrCreateChatService(members, name); // Truyền cả name và members vào service
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
    reducers: {},
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
  
        .addCase(getOrCreateChat.pending, (state) => { state.loading = true; })
        .addCase(getOrCreateChat.fulfilled, (state, action) => {
          state.loading = false;
          const existingChat = state.chats.find(chat => chat.id === action.payload);
          if (!existingChat) {
            state.chats.push({ 
              id: action.payload, 
              members: action.payload.members, 
              name: action.payload.name || "Unnamed Group Chat" // Lưu tên nhóm vào state, nếu không có tên thì mặc định là "Unnamed Group Chat"
            });
          }
        })
        .addCase(getOrCreateChat.rejected, (state, action) => {
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
  
  export default chatSlice.reducer;