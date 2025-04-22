import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import friendReducer from './friendSlice';
import chatReducer from './chatSlice'
import messageReducer from './messageSlice'
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
    key: 'root',
    storage,
  };
  
  // Persist tất cả reducers mà bạn muốn
  const persistedAuthReducer = persistReducer(persistConfig, authReducer);
  
  export const store = configureStore({
    reducer: {
      auth: persistedAuthReducer,
      friend: friendReducer,
      chat: chatReducer,
      message: messageReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  // Khởi tạo persistor để dùng trong PersistGate
  export const persistor = persistStore(store);
  
  export default store;