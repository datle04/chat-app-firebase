import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import NotificationScreen from './NotificationScreen';
import SearchResults from './SearchResults';

const SearchBar = ({
    search,
    setSearch,
    selectedUser,
    setSelectedUser
}) => {   

  const [notiScreen, setNotiScreen] = useState(false)

  return (
    <div 
        className='
            w-full h-14 flex bg-sky-500 fixed top-0 left-0 right-0 z-10
    '>
      <div className='w-[15%] flex justify-center items-center text-white text-2xl font-bold'>
        <CiSearch />
      </div>
      <div className='w-[70%] flex items-center text-white'>
        <input 
            type="text" 
            placeholder='Search a user...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-full px-5 outline-0 text-md font-semibold'
        />
      </div>
      <div className='w-[15%] flex justify-center items-center text-white text-2xl font-bold cursor-pointer'>
        <FaBell 
          onClick={() => setNotiScreen(!notiScreen)}
          className='
            relative text-lg 
        '/>
        {
          notiScreen && (
            <NotificationScreen notiSrcreen={notiScreen} setNotiScreen={setNotiScreen}/>
          )
        }  
      </div>
      {
        search.length > 0 && (
          <SearchResults 
            search={search} 
            selectedUser={selectedUser} 
            setSelectedUser={setSelectedUser}
          />
        )
      }
    </div>
  )
}

export default SearchBar
