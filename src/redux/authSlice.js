import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signUpWithEmail, signInWithEmail, signInWithGoogle, logoutUser } from "../services/authService";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async (_, { rejectWithValue }) => {
    try {
      return await signInWithGoogle();
    } catch (error) {
      return rejectWithValue(error.message);
    }
});

export const loginWithEmail = createAsyncThunk("auth/loginWithEmail", async ({ email, password }, { rejectWithValue }) => {
    try {     
      return await signInWithEmail(email, password);
    } catch (error) {
      return rejectWithValue(error.message);
    }
});

export const registerWithEmail = createAsyncThunk("auth/registerWithEmail", async ({ email, password, username, phoneNumber, avatarUrl }, { rejectWithValue }) => {
    try {
      return await signUpWithEmail(email, password, username, phoneNumber, avatarUrl);
    } catch (error) {
      return rejectWithValue(error.message);
    }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch (error) {
      return rejectWithValue(error.message);
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, loading: false, error: null },
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
      },
      clearUser: (state) => {
        state.user = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginWithGoogle.pending, (state) => { state.loading = true; })
        .addCase(loginWithGoogle.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(loginWithGoogle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(loginWithEmail.pending, (state) => { state.loading = true; })
        .addCase(loginWithEmail.fulfilled, (state, action) => {          
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(loginWithEmail.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(registerWithEmail.pending, (state) => { state.loading = true; })
        .addCase(registerWithEmail.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(registerWithEmail.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(logout.pending, (state) => { state.loading = true; })
        .addCase(logout.fulfilled, (state) => {
          state.loading = false;
          state.user = null;
        })
        .addCase(logout.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
