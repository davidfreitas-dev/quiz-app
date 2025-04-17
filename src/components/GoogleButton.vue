<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuth } from '@/use/useAuth';

const router = useRouter();
const userStore = useUserStore();
const { signInWithGoogle } = useAuth();

const logInWithGoogle = async () => {
  const response = await signInWithGoogle();

  try {
    await userStore.saveUser({
      id: response.data.uid,
      email: response.data.email,
      name: response.data.displayName,
      image: response.data.photoURL
    });
    router.push('/');
  } catch (error) {
    console.log('Error: ', error);
  }
};
</script>

<template>
  <div class="relative flex py-3 items-center">
    <div class="flex-grow border-t text-dark" />
    <span class="flex-shrink mx-4 text-dark">ou</span>
    <div class="flex-grow border-t text-dark" />
  </div>

  <button
    type="button"
    class="flex flex-row justify-center items-center gap-2 cursor-pointer py-3 px-4 shadow-lg border border-light bg-white rounded-xl font-semibold text-black text-sm w-full h-12 transition-colors"
    @click="logInWithGoogle"
  >
    <img
      src="@/assets/google.svg"
      alt="Logo Google"
      class="w-5 h-5"
    >
    Entrar com Google
  </button>
</template>