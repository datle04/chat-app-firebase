import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase/config"

//     console.log(members);

//     try {
//         // Kiểm tra nếu số lượng thành viên là 2 hoặc nhiều hơn
//         if (members.length === 2) {
//             const sortedMembers = members.sort((a, b) => a.uid.localeCompare(b.uid)); // Sort theo UID để đảm bảo consistency
//             const [user1, user2] = sortedMembers;
//             const conversationKey = [user1.uid, user2.uid].join('_');
//             const chatRef = doc(db, 'chats', conversationKey);
//             const chatSnap = await getDoc(chatRef);

//             if (chatSnap.exists()) {
//                 return chatSnap.id; // Nếu cuộc trò chuyện đã có, trả về ID
//             } else {
//                 await setDoc(chatRef, {
//                     members: [user1, user2], // Lưu thông tin người dùng thay vì chỉ UID
//                     membersId: [user1.uid, user2.uid], // Thêm membersId lưu UID của các thành viên
//                     conversationKey: conversationKey,
//                     createdAt: serverTimestamp(),
//                     updatedAt: serverTimestamp(),
//                     name: "", // Không có tên nhóm cho chat riêng
//                 });
//                 return chatRef.id; // Trả về ID mới khi tạo cuộc trò chuyện mới
//             }
//         } else {
//             // Trường hợp tạo nhóm chat với nhiều thành viên
//             const sortedMembers = members.sort((a, b) => a.uid.localeCompare(b.uid)); // Sort theo UID
//             const conversationKey = sortedMembers.map(user => user.uid).join('_');
//             const chatRef = doc(db, 'chats', conversationKey);
//             const chatSnap = await getDoc(chatRef);

//             if (chatSnap.exists()) {
//                 return chatSnap.id; // Nếu nhóm chat đã tồn tại, trả về ID
//             } else {
//                 await setDoc(chatRef, {
//                     members: sortedMembers, // Lưu thông tin người dùng thay vì chỉ UID
//                     membersId: sortedMembers.map(user => user.uid), // Thêm membersId lưu UID của các thành viên
//                     conversationKey: conversationKey,
//                     createdAt: serverTimestamp(),
//                     updatedAt: serverTimestamp(),
//                     name: name, // Lưu tên nhóm vào Firestore
//                     groupAvatar: groupAvatar,
//                 });
//                 return chatRef.id; // Trả về ID mới khi tạo nhóm chat
//             }
//         }
//     } catch (error) {
//         console.error('Lỗi khi getOrCreateChat:', error);
//         throw error;
//     }
// };

export const getChatService = async (members) => {
    const sortedMembers = members.sort((a, b) => a.uid.localeCompare(b.uid));
    const conversationKey = sortedMembers.map(user => user.uid).join('_');
    const chatRef = doc(db, 'chats', conversationKey);
    const chatSnap = await getDoc(chatRef);
  
    // Trả về null nếu không có cuộc trò chuyện nào
    if (chatSnap.exists()) {
      return chatRef.id;  // trả về chatId nếu có
    } else {
      return null;  // Không có cuộc trò chuyện
    }
  };

  export const createChatService = async (members, name = "", groupAvatar = "") => {
    const sortedMembers = members.sort((a, b) => a.uid.localeCompare(b.uid));
    const conversationKey = sortedMembers.map(user => user.uid).join('_');
    const chatRef = doc(db, 'chats', conversationKey);
  
    const payload = {
      members: sortedMembers,
      membersId: sortedMembers.map(user => user.uid),
      conversationKey,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  
    if (members.length > 2) {
      payload.name = name;
      payload.groupAvatar = groupAvatar;
    }
  
    // Tạo cuộc trò chuyện mới khi người dùng gửi tin nhắn
    await setDoc(chatRef, payload);
    return chatRef.id;  // trả về chatId khi cuộc trò chuyện được tạo
  };


export const listenToUserChats = (userId, onUpdate) => {
  
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('membersId', 'array-contains', userId));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      onUpdate(updatedChats);
    });
  
    return unsubscribe;
  };

  
export const getUserChats = async (userId) => {
    try {
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('membersId', 'array-contains', userId));

        const querySnapShot = await getDocs(q);
        return querySnapShot.docs.map((doc) => {
            const data = doc.data();
        
            const createdAt = data.createdAt?.toDate().toISOString() || null;
            const updatedAt = data.updatedAt?.toDate().toISOString() || null;
            const lastMessage = data.lastMessage || null;
        
            return {
                id: doc.id,
                ...data,
                createdAt,
                updatedAt,
                lastMessage,
            };
        });
    } catch (error) {
        console.log(error);
        return []
    }
};

export const addMemberToChat = async (chatId, userId) => {
    try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {members: arrayUnion(userId)});
    } catch (error) {
        console.log(error);
    }
}