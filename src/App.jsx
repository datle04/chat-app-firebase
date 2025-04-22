import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatPage from './pages/ChatPage'
import { auth } from './firebase/config'
import useAuth from './hooks/useAuth'
import { useSelector } from 'react-redux'


function App() {

  const { loading } = useAuth();
  const user = useSelector(state => state.auth.user); 

  if (loading) {
    return (
      <div className='flex justify-center items-center w-full h-screen'>
        <img src={viteLogo} className="animate-spin" alt="Vite logo" />
      </div>
    );
  }

  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<ChatPage/>} />
        </Routes>
      </BrowserRouter>
    </>
    // <div className='w-20 h-20 bg-red-500'></div>
  )
}

export default App
