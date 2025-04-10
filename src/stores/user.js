import { defineStore } from 'pinia';
import { ref } from 'vue';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isLoading = ref(false);  

  const withLoading = async (fn) => {
    isLoading.value = true;
    try {
      await fn();
    } catch (err) {
      console.error('Erro na operação: ', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUserData = async (uid) => {
    await withLoading(async () => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        throw new Error('Usuário não encontrado.');
      }
    });
  };

  const saveUser = async (userData) => {
    await withLoading(async () => {
      const userRef = doc(db, 'users', userData.id);        
      await setDoc(userRef, userData, { merge: true });
      setUser(userData);
    });
  };

  const updateUser = async (updatedData) => {
    await withLoading(async () => {
      const userRef = doc(db, 'users', updatedData.id);
      await updateDoc(userRef, updatedData);
      setUser(updatedData);
    });
  };
  
  const deleteUser = async (uid) => {
    await withLoading(async () => {
      const userRef = doc(db, 'users', uid);
      await deleteDoc(userRef);
      clearUser();
    });
  };

  const setUser = (userData) => {
    user.value = userData;
    console.log('USER: ', user.value);
  };

  const clearUser = () => {
    user.value = null;
  };

  return {
    user,
    isLoading,
    fetchUserData,
    saveUser,
    updateUser,
    deleteUser,
    setUser,
    clearUser
  };
});
