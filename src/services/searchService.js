import { collection, endAt, getDocs, or, orderBy, query, startAt, where } from "firebase/firestore"
import { db } from "../firebase/config";

const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };
  
  export const searchUserByUsername = async (searchText) => {
      const usersRef = collection(db, 'users');
      const normalizedSearch = normalizeString(searchText);
  
      const q = query(
          usersRef,
          orderBy('username_lowercase'),
          startAt(normalizedSearch),
          endAt(normalizedSearch + '\uf8ff')
      );
  
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

export const searchUserByPhone = async (searchText) => {
    const usersRef = collection(db, 'users');

    const q = query(
        usersRef,
        orderBy("phoneNumber"),
        startAt(searchText),
        endAt(searchText + "\uf8ff")
      );

    const querySnapShot = await getDocs(q);
    return querySnapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};