import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, db, googleProvider } from "../firebase/config"
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userRef = doc(db, 'users', user.uid);
        let docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                avatar: user.photoURL,
                username_lowercase: normalizeString(user.displayName),
                phoneNumber: user.phoneNumber || "",
                createdAt: serverTimestamp(),
                friends: [],
                friendRequests: [],
                friendRequestsSent: [],
            });

            docSnap = await getDoc(userRef); // get lại doc mới tạo
        }

        const userData = docSnap.data();

        return {
            uid: userData.uid,
            email: userData.email,
            username: userData.username,
            avatar: userData.avatar,
            phoneNumber: userData.phoneNumber || "",
            createdAt: userData.createdAt?.toDate().toISOString() || "",
        };

    } catch (error) {
        console.error("Google Sign-in Error: ", error.message);
        throw new Error(error.message);
    }
};


export const signUpWithEmail = async (email, password, username, phone = "", avatarUrl = "") => {
    try {
        console.log(username);
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapShot = await getDocs(q);

        if (querySnapShot.size > 0) {
            throw new Error("Username already taken");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            uid: user.uid,
            email: user.email,
            username,
            avatar: avatarUrl,
            phone,
            username_lowercase: normalizeString(username),
            createdAt: serverTimestamp(),
            friends: [],
            friendRequests: [],
            friendRequestsSent: [],
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        const returnData = {
            ...userData,
            createdAt: serverTimestamp().toISOString(),
        };
        return returnData;

    } catch (error) {
        console.error("Sign Up Error: ", error.message);
        throw new Error(error.message);
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            throw new Error("User not found");
        }
        const userData = userDocSnap.data();
        console.log(userData);
        
        return {
            uid: userData.uid,
            email: userData.email,
            username: userData.username,
            avatar: userData.avatar,
            phone: userData.phone || "",
            createdAt: userData.createdAt?.toDate().toISOString(),
        }
    } catch (error) {
        console.log(error);
    }
};

export const logoutUser = async () => {
    return toast.promise(
        (async () => {
            await signOut(auth);
        })(),
        {
            loading: "Signing out...",
            success: "Sign out successfully!",
            error: "Something is wrong!",
        }
    );
};
