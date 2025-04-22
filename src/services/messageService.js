import { 
    addDoc, 
    arrayUnion, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    onSnapshot,
    orderBy, 
    query, 
    serverTimestamp, 
    updateDoc, 
    where 
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Gửi tin nhắn vào chat
 */
export const sendMessageToChat = async ({senderId, chatId, content = "", attachment = ""}) => {
    console.log(
        "Function called with parameters: ", 
        { senderId, chatId, content, attachment }
    );
    
    try {
        const messageRef = collection(db, 'messages');
        const newMessage = {
            chatId,
            senderId,
            content,
            attachment,
            timestamp: serverTimestamp(),
            isDeleted: false,
            readBy: []
        };
        const docRef = await addDoc(messageRef, newMessage);
        return {
            id: docRef.id,
            ...newMessage,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error };
    }
};

/**
 * Lấy tất cả message của chatId
 */
export const getMessages = async (chatId) => {
    try {
        const messageRef = collection(db, 'messages');
        const q = query(
            messageRef, 
            where('chatId', '==', chatId), 
            orderBy('timestamp', 'asc')
        );

        const querySnapShot = await getDocs(q);
        return querySnapShot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate().toISOString() || null
            };
        });
        // return querySnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting messages:", error);
        return [];
    }
};

/**
 * Listen message theo real-time
 */
export const listenMessages = (chatId, callback) => {
    try {
        const messageRef = collection(db, 'messages');
        const q = query(
            messageRef, 
            where('chatId', '==', chatId), 
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(messages);
        });

        return unsubscribe; // Cần nhớ return để sau này hủy listener cho đỡ tốn tài nguyên
    } catch (error) {
        console.error("Error listening to messages:", error);
        return () => {};
    }
};

/**
 * Đánh dấu tin nhắn đã đọc
 */
export const markMessageAsRead = async (messageId, userId) => {
    try {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, {
            readBy: arrayUnion(userId)
        });
    } catch (error) {
        console.error("Error marking message as read:", error);
    }
};

/**
 * Thu hồi tin nhắn
 */
export const recallMessage = async (messageId) => {
    try {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, {
            content: 'Message is deleted',
            isDeleted: true
        });
    } catch (error) {
        console.error("Error recalling message:", error);
    }
};

/**
 * Lấy danh sách user đã đọc message
 */
export const getMessageReadStatus = async (messageId) => {
    try {
        const messageRef = doc(db, 'messages', messageId);
        const messageSnap = await getDoc(messageRef);

        if (messageSnap.exists()) {
            return messageSnap.data().readBy || [];
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting read status:", error);
        return [];
    }
};
