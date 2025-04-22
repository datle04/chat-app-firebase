import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase/config"

export const getOrCreateChatService = async (members, name = "", groupAvatar = "") => {
    console.log(members);

    try {
        // Kiểm tra nếu số lượng thành viên là 2 hoặc nhiều hơn
        if (members.length === 2) {
            const sortedMembers = members.sort((a, b) => a.uid.localeCompare(b.uid)); // Sort theo UID để đảm bảo consistency
            const [user1, user2] = sortedMembers;
            const conversationKey = [user1.uid, user2.uid].join('_');
            const chatRef = doc(db, 'chats', conversationKey);
            const chatSnap = await getDoc(chatRef);

            if (chatSnap.exists()) {
                return chatSnap.id; // Nếu cuộc trò chuyện đã có, trả về ID
            } else {
                await setDoc(chatRef, {
                    members: [user1, user2], // Lưu thông tin người dùng thay vì chỉ UID
                    membersId: [user1.uid, user2.uid], // Thêm membersId lưu UID của các thành viên
                    conversationKey: conversationKey,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    name: "", // Không có tên nhóm cho chat riêng
                });
                return chatRef.id; // Trả về ID mới khi tạo cuộc trò chuyện mới
            }
        } else {
            // Trường hợp tạo nhóm chat với nhiều thành viên
            const sortedMembers = members.sort((a, b) => a.uid.localeCompare(b.uid)); // Sort theo UID
            const conversationKey = sortedMembers.map(user => user.uid).join('_');
            const chatRef = doc(db, 'chats', conversationKey);
            const chatSnap = await getDoc(chatRef);

            if (chatSnap.exists()) {
                return chatSnap.id; // Nếu nhóm chat đã tồn tại, trả về ID
            } else {
                await setDoc(chatRef, {
                    members: sortedMembers, // Lưu thông tin người dùng thay vì chỉ UID
                    membersId: sortedMembers.map(user => user.uid), // Thêm membersId lưu UID của các thành viên
                    conversationKey: conversationKey,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    name: name, // Lưu tên nhóm vào Firestore
                    groupAvatar: groupAvatar,
                });
                return chatRef.id; // Trả về ID mới khi tạo nhóm chat
            }
        }
    } catch (error) {
        console.error('Lỗi khi getOrCreateChat:', error);
        throw error;
    }
};

  
export const getUserChats = async (userId) => {
    try {
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('membersId', 'array-contains', userId));

        const querySnapShot = await getDocs(q);
        return querySnapShot.docs.map((doc) => {
            const data = doc.data();

            // Chuyển đổi Timestamp thành ISO string trước khi trả về
            const createdAt = data.createdAt?.toDate().toISOString() || null;
            const updatedAt = data.updatedAt?.toDate().toISOString() || null;

            return {
                id: doc.id,
                ...data,
                createdAt,
                updatedAt
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