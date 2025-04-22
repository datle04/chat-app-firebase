// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4axpDNqHjbsyIKjwF6gnXk0FRtYXAVHg",
  authDomain: "chat-app-9284e.firebaseapp.com",
  databaseURL: "https://chat-app-9284e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-9284e",
  storageBucket: "chat-app-9284e.firebasestorage.app",
  messagingSenderId: "458424066392",
  appId: "1:458424066392:web:84baf143cbe8df1783452d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);