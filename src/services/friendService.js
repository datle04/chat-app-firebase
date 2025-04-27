import { arrayUnion, doc, getDoc, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"

export const getFriends = async (userId) => {
    const userRef = doc(db, 'users', userId);

    const userSnap = await getDoc(userRef);
    return {
        friends: userSnap.data().friends || [],
        friendRequests: userSnap.data().friendRequests || [],
        friendRequestsSent: userSnap.data().friendRequestsSent || [],
    }
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
                friends: updatedUserData.friends || [],
                friendRequests: updatedUserData.friendRequests || [],
                friendRequestsSent: updatedUserData.friendRequestsSent || [],
            },
            targetUser: {
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

export const acceptFriendRequestService = async (currentUser, targetUser) => {
    const userRef = doc(db, "users", currentUser.uid);
    const targetUserRef = doc(db, "users", targetUser.uid);
  
    try {
      const result = await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const targetUserDoc = await transaction.get(targetUserRef);
  
        if (!userDoc.exists() || !targetUserDoc.exists()) {
          throw "User not found!";
        }
  
        const userData = userDoc.data();
        const targetUserData = targetUserDoc.data();
  
        // Cập nhật friends list
        const updatedFriends = [...(userData.friends || []), {
          uid: targetUser.uid,
          username: targetUser.username,
          avatar: targetUser.avatar
        }];
        const updatedFriendsTarget = [...(targetUserData.friends || []), {
          uid: currentUser.uid,
          username: currentUser.username,
          avatar: currentUser.avatar
        }];
  
        // Cập nhật friendRequests
        const updatedFriendRequests = (userData.friendRequests || []).map((req) => {
          if (req.senderId === targetUser.uid) {
            return { ...req, status: "accepted" };
          }
          return req;
        });
  
        const updatedFriendRequestsSent = (targetUserData.friendRequestsSent || []).map((req) => {
          if (req.targetUserId === currentUser.uid) {
            return { ...req, status: "accepted" };
          }
          return req;
        });
  
        // Ghi lại vào Firestore
        transaction.update(userRef, {
          friends: updatedFriends,
          friendRequests: updatedFriendRequests,
        });
  
        transaction.update(targetUserRef, {
          friends: updatedFriendsTarget,
          friendRequestsSent: updatedFriendRequestsSent,
        });
  
        // Đây là dữ liệu mình trả ra để Redux update nè
        return {
          updatedCurrentUser: {
            friends: updatedFriends,
            friendRequests: updatedFriendRequests,
          },
          updatedTargetUser: {
            friends: updatedFriendsTarget,
            friendRequestsSent: updatedFriendRequestsSent,
          },
        };
      });
  
      return result; // <<< result chính là data cho slice
    } catch (error) {
      console.error("Accept friend thất bại ❌: ", error);
      throw error; // đẩy lỗi lên nếu cần xử lý ở Redux
    }
  };

