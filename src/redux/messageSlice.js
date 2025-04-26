import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMessages, listenMessages, recallMessage, sendMessageToChat } from "../services/messageService";

// Lấy danh sách tin nhắn
export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (chatId, { rejectWithValue }) => {
    try {
      return await getMessages(chatId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  // Gửi tin nhắn
  export const sendMessage = createAsyncThunk("messages/sendMessage", async (message, { rejectWithValue }) => {
    try {
      return await sendMessageToChat(message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  // Thu hồi tin nhắn
  export const deleteMessage = createAsyncThunk("messages/deleteMessage", async (messageId, { rejectWithValue }) => {
    try {
      return await recallMessage(messageId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  const messageSlice = createSlice({
    name: "messages",
    initialState: { messages: [], loading: false, error: null },
    reducers: {
      setMessages: (state, action) => {
        state.messages = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchMessages.pending, (state) => { state.loading = true; })
        .addCase(fetchMessages.fulfilled, (state, action) => {
          state.loading = false;
          state.messages = action.payload;
        })
        .addCase(fetchMessages.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(sendMessage.pending, (state) => { state.loading = true; })
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(sendMessage.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(deleteMessage.pending, (state) => { state.loading = true; })
        .addCase(deleteMessage.fulfilled, (state, action) => {
          state.loading = false;
          const msg = state.messages.find(msg => msg.id === action.payload.messageId);
          if (msg) {
              msg.content = "Message is deleted"; 
              msg.isDeleted = true;
          }
        })
        .addCase(deleteMessage.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
export const { setMessages } = messageSlice.actions;

// Hàm để gọi listenMessages trong Redux
export const listenMessagesRealtime = (chatId) => (dispatch) => {
  const unsubscribe = listenMessages(chatId, (messages) => {
    // Chuyển đổi timestamp thành ISO string
    const updatedMessages = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp?.toDate().toISOString() || null, // Chuyển Timestamp thành ISO string
    }));

    dispatch(setMessages(updatedMessages)); // Dispatch action với dữ liệu đã chuyển đổi
  });

  return unsubscribe; // Trả về hàm unsubscribe để hủy listener khi không cần thiết
};


  export default messageSlice.reducer;