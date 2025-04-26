import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { getFriends, sendFriendRequest } from "../services/friendService";
import { setUser } from './authSlice.js'
export const fetchFriends = createAsyncThunk('friends/fetchFriends', async (userId, { rejectWithValue }) => {
    try {
        return await getFriends(userId);
      } catch (error) {
        return rejectWithValue(error.message);
      }
});

export const sendRequest = createAsyncThunk("friends/sendRequest", async ({ currentUserId, targetUserId, authUser }, { rejectWithValue, dispatch }) => {
    try {
      const response = await sendFriendRequest(currentUserId, targetUserId, authUser);
      console.log(response.currentUser);

      dispatch(setUser(response.currentUser))
      return response
    } catch (error) {
      return rejectWithValue(error.message);
    }
});

const friendSlice = createSlice({
    name: "friends",
    initialState: { friends: [], friendRequests: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchFriends.pending, (state) => { state.loading = true; })
        .addCase(fetchFriends.fulfilled, (state, action) => {
          state.loading = false;
          state.friends = action.payload;
        })
        .addCase(fetchFriends.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(sendRequest.pending, (state) => { state.loading = true; })
        .addCase(sendRequest.fulfilled, (state, action) => {      
          state.loading = false;
          state.friendRequests.push({ userId: action.payload.targetUserId, status: "pending" });
      })
        .addCase(sendRequest.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
});
  
export default friendSlice.reducer;