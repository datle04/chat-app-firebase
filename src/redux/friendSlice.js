import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { getFriends, sendFriendRequest } from "../services/friendService";
import { setUser } from './authSlice.js'
import { acceptFriendRequestService } from "../services/friendService.js";
import { db } from "../firebase/config.js";
import { doc, onSnapshot } from "firebase/firestore";

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

      dispatch(setUser(response.currentUser))
      return response
    } catch (error) {
      return rejectWithValue(error.message);
    }
});

export const acceptFriendRequest = createAsyncThunk("friends/acceptFriendRequest", async ({ currentUser, targetUser}, {rejectWithValue}) => {
  try {
    const result = await acceptFriendRequestService(currentUser, targetUser);
    return result;
  } catch (error) {
    return rejectWithValue(error.message);
  }
})


const friendSlice = createSlice({
    name: "friends",
    initialState: { friends: [], friendRequests: [], friendRequestsSent: [], loading: false, error: null },
    reducers: {
      setFriends: (state, action) => {
        state.friends = action.payload;
      },
      setFriendRequests: (state, action) => {
        state.friendRequests = action.payload;
      },
      setFriendRequestsSent: (state, action) => {
        state.friendRequestsSent = action.payload;
      },
    },
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
        })
        .addCase(acceptFriendRequest.pending, (state) => { 
          state.loading = true;
        })
        .addCase(acceptFriendRequest.fulfilled, (state, action) => {
          state.loading = false;
          state.friends = action.payload.currentUser.friends;
          state.friendRequests = action.payload.currentUser.friendRequests.filter(item => item.senderId !== action.payload.targetUser.uid);
          state.friendRequestsSent = action.payload.targetUser.friendRequestsSent.filter(item => item.targetUserId !== action.payload.currentUser.uid);
        })
        .addCase(acceptFriendRequest.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
});

// Lắng nghe friend requests realtime từ firebase
export const listenToFriendRequests =  (userId) => (dispatch) => {
  const userRef = doc(db, 'users', userId);

  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      dispatch(setFriendRequests(data.friendRequests || []));
      dispatch(setFriendRequestsSent(data.friendRequestsSent || []));
    }
  }, (error) => {
    console.log(error);
  }
)
}

export const { setFriends, setFriendRequests, setFriendRequestsSent } = friendSlice.actions;

export default friendSlice.reducer;