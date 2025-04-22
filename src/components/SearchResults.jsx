import React, { useEffect, useState } from 'react'
import { searchUserByUsername } from '../services/searchService'
import { useSelector } from 'react-redux'

const SearchResults = ({ search, selectedUser, setSelectedUser}) => {
    const authUser = useSelector(state => state.auth.user);
    const [searchResult, setSearchResult] = useState([])

    useEffect(() => {
        const fetchSearch = setTimeout(async () => {
            if (search.length > 0) {
                const result = await searchUserByUsername(search);
                // setSearchResult(result);
                setSearchResult(result.filter((item => item.username !== authUser.username)));
                console.log(result);
            }
        }, 300);
        return () => clearTimeout(fetchSearch)
    },[search])

  return (   
    <div className='w-full h-full fixed top-14 flex flex-col items-center z-10 bg-white overflow-y-scroll'>
        {
            searchResult.length !== 0 ? (
                searchResult.map((item, index) => (
                    <div
                        onClick={() => setSelectedUser(item)}
                        className='
                            w-full flex items-center start gap-5 px-4 py-2 border border-slate-100
                    '>
                        <div className='flex items-center gap-2'>
                            <img src={item.avatar} alt="Avatar" className='w-12 h-12 rounded-full object-cover object-center' />
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold flex items-center gap-2'>
                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                {item.username}
                            </h3>
                        </div>
                    </div>
                ))
            )    
            :
            (
                <div className='w-full h-full flex justify-center items-center'>
                    <h3 className='mb-30 text-lg font-semibold text-gray-500'>No user found</h3>
                </div>
            )       
        }
    </div>
  )
}

export default SearchResults
