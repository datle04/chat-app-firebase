import React, { useEffect, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux"
import { auth } from '../firebase/config';
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, registerWithEmail, setUser } from '../redux/authSlice';
import AuthForm from '../components/AuthForm';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const LoginPage = () => {

    const navigate = useNavigate()
    const [formSignin, setFormSignin] = useState(true);
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [avatar, setAvatar] = useState('')
    const authUser = useSelector(state => state.auth)

    const toggleForm = () => {
        setFormSignin(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formSignin === true){
            try {                             
                const resultAction = await dispatch(loginWithEmail({ email, password }));
                const user = resultAction.payload; // <-- lấy đúng payload nè!
    
                console.log("User data from API:", user);
    
                setEmail("");
                setUsername("");
                setPassword("");
    
                dispatch(setUser(user)); // giờ user đúng rồi đó
    
                toast.success("Sign in successfully!");
                navigate("/"); // move vào đây sau khi chắc chắn thành công
            } catch (error) {
                console.log(error);
                toast.error("Something is wrong!");
            }
    
        } else {
            try {
                let avatarUrl = "";
                if (avatar) {
                    avatarUrl = await uploadImageToCloudinary(avatar);
                }    
    
                await dispatch(registerWithEmail({ email, password, username, phoneNumber, avatarUrl }));
                toast.success("User created successfully!");
    
                setEmail("");
                setPassword("");
                setUsername("");
                setPhoneNumber("");
                setAvatar("");
    
            } catch (error) {
                console.log(error);
                toast.error("Something is wrong!");
            }
        }
    }
    
    const handleSignInGoogle = async () => {
        try {
            const user = await dispatch(loginWithGoogle()).unwrap();
            toast.success("Sign in successfully!");

            dispatch(setUser(user))
            navigate("/")
        } catch (error) {
            console.log(error)
            toast.error("Something is wrong!")
        }
    }

  return (
    <div className='w-full h-screen bg-cover bg-center' 
        style={{backgroundImage: `url(https://images.pexels.com/photos/27135833/pexels-photo-27135833/free-photo-of-sydney-harbour-bridge.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}}
    >
    <div className='flex justify-center items-center bg-black/30 backdrop-blur-[5px]' style={{width: 'inherit', height: 'inherit'}}>
        <div className='w-[90%] p-3 flex flex-col gap-5 justify-center bg-white sm:w-[60%] lg:w-[50%] xl:w-[35%] 2xl:w-[30%]'>
            <h2 className='text-3xl font-semibold text-center sm:text-4xl lg:mt-5 lg:mb-7 lg:text-4xl lg:font-bold 2xl:text-4xl'>
                {formSignin ? "Sign in" : "Sign up"}
            </h2>
            <AuthForm 
                title={formSignin ? "Sign in" : "Sign up"}
                buttonText={formSignin ? "Submit" : "Register"}
                toggleText={formSignin ? "Don't have an account?" : "Already have an account?"}
                onSubmit={handleSubmit}
                onToggle={toggleForm}
                email = {email}
                setEmail = {setEmail}
                username = {username}
                setUsername = {setUsername}
                password = {password}
                setPassword = {setPassword}
                phoneNumber = {phoneNumber}
                setPhoneNumber = {setPhoneNumber}
                avatar = {avatar}
                setAvatar = {setAvatar}
            />
            <div className='flex justify-center items-center'>
                <hr className='w-[70%] ml-5 bg-black'/>
                <span className='px-3 text-xl'>Or</span>
                <hr className='w-[70%] mr-5 bg-black'/>
            </div>
            <button onClick={handleSignInGoogle} className='w-3xs h-12 mb-8 flex justify-center items-center self-center gap-1.5 text-xl font-semibold text-gray-700 border border-gray-500 cursor-pointer hover:bg-gray-200'>
                Sign in with Google <FcGoogle />
            </button>
        </div>
    </div>
    </div>
    );
}

export default LoginPage
