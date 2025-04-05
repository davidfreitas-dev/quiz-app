<script setup>
import { ref, reactive } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useRouter } from 'vue-router';
import { useAuth } from '@/use/useAuth';
import { useException } from '@/use/useException';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';
import Container from '@/components/Container.vue';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import GoogleButton from '@/components/GoogleButton.vue';
import Toast from '@/components/Toast.vue';

const getUser = async (userId) => {
  const docSnap = await getDoc(doc(db, 'users', userId));  
  const userData = docSnap.exists() ? docSnap.data() : undefined;

  setStorage('user', userData);
};

const isLoading = ref(false);

const formData = reactive({
  email: '',
  password: ''
});

const router = useRouter();

const login = async () => {
  isLoading.value = true;

  const response = await signIn(formData);

  if (response.status == 'success') {
    await getUser(response.data.uid);

    router.push('/');
  } else {
    handleException(response.code);
    
    handleToast(response.status, exception);
  }

  isLoading.value = false;
};

const validateForm = (event) => {
  event.preventDefault();

  if (!formData.email || !formData.password) {
    handleToast('error', 'Informe seu e-mail e senha.');
    return;
  }  

  login();
};

const { signIn } = useAuth();
const { setStorage } = useStorage();
const { handleException, exception } = useException();
const { toast, toastData, handleToast } = useToast();
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen text-dark p-7">
    <header class="flex flex-col items-start w-full">
      <Heading
        size="lg"
        text="Bem-vindo 👋"
        class="mt-4"
      />

      <Text 
        size="md"
        text="Entre e participe agora mesmo!"
        class="mt-1"
      />
    </header>

    <form
      @submit="validateForm"
      class="flex flex-col gap-4 items-stretch w-full mt-10"
    >
      <div class="flex flex-col gap-3">
        <label
          class="font-semibold"
          for="lblEmail"
        >
          Endereço de e-mail
        </label>

        <TextInput
          v-model="formData.email"
          type="email"
          icon="EnvelopeIcon"
          text="johndoe@email.com"
        />
      </div>

      <div class="flex flex-col gap-3">
        <label
          class="font-semibold"
          for="lblPassword"
        >
          Sua senha
        </label>

        <TextInput
          v-model="formData.password"
          type="password"
          icon="LockClosedIcon"
          text="**********"
          @on-keyup-enter="validateForm"
        />
      </div>

      <Button
        text="Entrar na plataforma"
        :is-loading="isLoading"
        class="mt-4"
      />

      <GoogleButton />
    </form>

    <footer class="flex flex-col items-center gap-4 my-8">
      <router-link to="/forgot">
        <Text
          size="sm"
          text="Esqueceu sua senha?"
          class="text-gray-400 cursor-pointer hover:text-brand-hover hover:underline"
        />
      </router-link>

      <router-link to="/signup">
        <Text
          size="sm"
          text="Não possui conta?"
          class="text-gray-400 cursor-pointer hover:text-gray-200"
        />

        <Text
          size="sm"
          text=" Crie uma agora!"
          class="text-gray-400 cursor-pointer hover:text-brand-hover hover:underline"
        />
      </router-link>
    </footer>

    <Toast
      ref="toast"
      :toast-data="toastData"
    />
  </div>
</template>