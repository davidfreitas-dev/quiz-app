import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';

export const useUserStore = defineStore('user', () => {
  const auth = getAuth();
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

  const fetchUser = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Usuário não autenticado');
  
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error('Usuário não encontrado no banco');
    
    setUser({ id: uid, ...userSnap.data() });
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
  };

  const clearUser = () => {
    user.value = null;
  };

  return {
    user,
    isLoading,
    fetchUser,
    saveUser,
    updateUser,
    deleteUser,
    setUser,
    clearUser
  };
});
