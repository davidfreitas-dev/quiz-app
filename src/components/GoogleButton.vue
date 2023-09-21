<script setup>
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const getUser = async (userId) => {
  const docSnap = await getDoc(doc(db, 'users', userId)); 

  return docSnap.exists() ? docSnap.data() : undefined;
};

const saveData = async (userData) => {
  const usersRef = doc(db, 'users', userData.id);

  await setDoc(usersRef, userData);
};

const userStore = useUserStore();

const router = useRouter();

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();    

  signInWithPopup(getAuth(), provider)
    .then(async (result) => {
      let userData = await getUser(result.user.uid);
        
      if (!userData) {
        userData = {
          id: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          image: result.user.photoURL,
          quizzes: [],
          score: 0
        };

        saveData(userData);
      } 

      userStore.setUser(userData);

      router.push('/');
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<template>
  <div class="relative flex py-5 items-center">
    <div class="flex-grow border-t text-primary-font" />
    <span class="flex-shrink mx-4 text-primary-font">ou</span>
    <div class="flex-grow border-t text-primary-font" />
  </div>

  <button
    type="button"
    class="flex flex-row justify-center items-center gap-2 cursor-pointer py-3 px-4 shadow-lg border border-light bg-white rounded-xl font-semibold text-black text-sm w-full h-12 transition-colors"
    @click="signInWithGoogle"
  >
    <img
      src="@/assets/google.svg"
      alt="Logo Google"
      class="w-5 h-5"
    >
    Entrar com Google
  </button>
</template>