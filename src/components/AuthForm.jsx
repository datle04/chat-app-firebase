import React from 'react'

const AuthForm = ({ 
    title, 
    buttonText, 
    toggleText, 
    onSubmit, 
    onToggle,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    phoneNumber,
    setPhoneNumber,
    avatar,
    setAvatar,
}) => {

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên
        if (file) {
            setAvatar(file);
        }
    };

    return (
        <form className='flex flex-col justify-center items-center gap-3'>
            <div className='w-full flex items-center sm:px-4 sm:justify-between'>
                <h3 className='w-24 sm:text-[1.1rem]'>Email:</h3>
                <input 
                    type="text" 
                    placeholder='Enter your email...'
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-[90%] py-2 px-3 outline-0 sm:text-[1.1rem]'
                />
            </div>
            {
                title === "Sign up" && (
                    <>
                    <div className='w-full flex items-center sm:px-4 sm:justify-between'>
                        <h3 className='w-24 sm:text-[1.1rem]'>Username:</h3>
                        <input 
                            type="text" 
                            placeholder='Enter your username...'
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-[90%] py-2 px-3 outline-0 sm:text-[1.1rem]'
                    /> 
                    </div>
                    <div className='w-full flex items-center sm:px-4 sm:justify-between'>
                        <h3 className='w-24 sm:text-[1.1rem]'>Phone:</h3>
                        <input 
                            type="text" 
                            placeholder='Enter your phone number...'
                            value={phoneNumber}
                            required
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className='w-[90%] py-2 px-3 outline-0 sm:text-[1.1rem]'
                    /> 
                    </div>
                    <div className='w-full flex items-center sm:px-4 sm:justify-between'>
                        <h3 className='w-24 sm:text-[1.1rem]'>Avatar:</h3>
                        <input 
                            type="file" 
                            placeholder='Upload your avatar...'
                            accept='image/*'
                            required
                            onChange={handleAvatarChange}
                            className='w-[90%] py-2 px-3 outline-0 sm:text-[1.1rem]'
                    /> 
                    </div>
                    </>
                )
            }
            <div className='w-full flex items-center sm:px-4 sm:justify-between'>
                <h3 className='w-24 sm:text-[1.1rem]'>Password:</h3>
                <input 
                    type="password" 
                    placeholder='Enter your password...'
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-[90%] py-2 px-3 outline-0 sm:text-[1.1rem]'
                /> 
            </div>
            <button
                type='submit'
                className='w-3xs h-12 bg-sky-500 text-white font-semibold cursor-pointer hover:bg-sky-600 sm:text-[1.1rem] sm:my-5'
                onClick={onSubmit}
            >
                {buttonText}
            </button>
            <span className='2xl:text-lg'>
                {toggleText} ‎
                <a 
                    className='underline cursor-pointer hover:text-sky-500'
                    onClick={onToggle}
                >
                    {title === "Sign in" ? "Sign up" : "Sign in"}
                </a>
            </span>
        </form>
    );
}

export default AuthForm
