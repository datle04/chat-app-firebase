import { arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"

export const getFriends = async (userId) => {
    const userRef = doc(db, 'users', userId);

    const userSnap = await getDoc(userRef);
    console.log(userSnap);
    return userSnap.data().friends || [];
}

export const sendFriendRequest = async (currentUserId, targetUserId) => {
    const userRef = doc(db, 'users', targetUserId);

    await updateDoc(userRef, {
        friendRequests: arrayUnion({
            senderId: currentUserId,
            status: 'pending',
            sentAt: serverTimestamp()
        })
    })
}

export const hasSentRequest = async (currentUserId, targetUserId) => {
    const userRef = doc(db, 'users', targetUserId);
    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()) return false;

    const { friendRequests } = userSnap.data();
    return friendRequests.some(req => req.senderId === currentUserId);
}