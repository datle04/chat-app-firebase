import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { doc, getDoc } from "firebase/firestore";

const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();                

                        // Dispatch user data into Redux only after Firestore data is available
                        dispatch(setUser({
                            uid: user.uid,
                            email: user.email,
                            username: userData.username,
                            avatar: userData.avatar,
                            phone: userData.phoneNumber || "",
                            createdAt: userData.createdAt.toDate().toISOString(),
                            friends: userData.friends || [],
                            friendRequests: userData.friendRequests || [],
                        }));
                    } else {
                        console.log("No user document found!");
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore: ", error.message);
                }
            } else {
                // Dispatch null when user logs out
                dispatch(setUser(null));
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener when component unmount
    }, [dispatch]);

    return { loading };
};

export default useAuth;