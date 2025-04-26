import { arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"

export const getFriends = async (userId) => {
    const userRef = doc(db, 'users', userId);

    const userSnap = await getDoc(userRef);
    console.log(userSnap);
    return userSnap.data().friends || [];
}

export const sendFriendRequest = async (currentUserId, targetUserId, authUser) => {
    const targetUserRef = doc(db, 'users', targetUserId);
    const userRef = doc(db, 'users', currentUserId);
    try {
        await updateDoc(targetUserRef, {
            friendRequests: arrayUnion({
                senderId: currentUserId,
                senderUsername: authUser.username,
                senderAvatar: authUser.avatar,
                status: "pending",
                sentAt: new Date().toISOString()
              })
        });
        await updateDoc(userRef, {          
            friendRequestsSent: arrayUnion({
                targetUserId: targetUserId,
                senderUsername: authUser.username,
                senderAvatar: authUser.avatar,
                status: "pending",
                sentAt: new Date().toISOString()
              })
        })

         // Lấy lại thông tin người dùng hiện tại
         const userDoc = await getDoc(userRef);
         const targetUserDoc = await getDoc(targetUserRef);
 
         const updatedUserData = userDoc.data();
         const updatedTargetUserData = targetUserDoc.data();

         return {
            currentUser: {
                uid: updatedUserData.uid,
                email: updatedUserData.email,
                username: updatedUserData.username,
                avatar: updatedUserData.avatar,
                phoneNumber: updatedUserData.phone || "",
                createdAt: updatedUserData.createdAt?.toDate().toISOString() || "",
                friends: updatedUserData.friends || [],
                friendRequests: updatedUserData.friendRequests || [],
                friendRequestsSent: updatedUserData.friendRequestsSent || [],
            },
            targetUser: {
                uid: updatedTargetUserData.uid,
                email: updatedTargetUserData.email,
                username: updatedTargetUserData.username,
                avatar: updatedTargetUserData.avatar,
                phoneNumber: updatedTargetUserData.phone || "",
                createdAt: updatedTargetUserData.createdAt?.toDate().toISOString() || "",
                friends: updatedTargetUserData.friends || [],
                friendRequests: updatedTargetUserData.friendRequests || [],
                friendRequestsSent: updatedTargetUserData.friendRequestsSent || [],
            }
        };
    } catch (error) {
        console.error("Failed to send request: ", error.message);
    }
}

export const hasSentRequest = async (currentUserId, targetUserId) => {
    const userRef = doc(db, 'users', targetUserId);
    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()) return false;

    const { friendRequests } = userSnap.data();
    return friendRequests.some(req => req.senderId === currentUserId);
}