<script setup>
import { useRouter } from 'vue-router';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const router = useRouter();

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();    

  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result.user);
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
    @click="signInWithGoogle"
    type="button"
    class="flex flex-row justify-center items-center gap-2 cursor-pointer py-3 px-4 shadow-lg border border-light bg-white rounded-xl font-semibold text-black text-sm w-full h-12 transition-colors"
  >
    <img
      src="@/assets/google.svg"
      alt="Logo Google"
      class="w-5 h-5"
    >
    Entrar com Google
  </button>
</template>