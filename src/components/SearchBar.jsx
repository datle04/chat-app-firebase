import React from 'react'
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";

const SearchBar = ({
    search,
    setSearch,
}) => {   
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
        <IoMdAdd  />
      </div>
    </div>
  )
}

export default SearchBar
