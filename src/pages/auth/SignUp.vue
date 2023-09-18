<script setup>
import { ref, reactive } from 'vue';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useAuth } from '@/use/useAuth';
import { useException } from '@/use/useException';
import { useToast } from '@/use/useToast';
import { useRouter } from 'vue-router';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import GoogleButton from '@/components/GoogleButton.vue';
import Toast from '@/components/Toast.vue';

const router = useRouter();

const formData = reactive({
  name: '',
  email: '',
  password: ''
});

const saveData = async (userData) => {
  const usersRef = doc(db, 'users', userData.id);

  await setDoc(usersRef, userData);
};

const isLoading = ref(false);

const register = async () => {
  isLoading.value = true;

  const response = await signUp(formData);

  if (response.status == 'success') {
    handleToast(response.status, 'Cadastro efetuado com sucesso!');

    saveData({
      id: response.data.uid,
      email: response.data.email,
      name: formData.name,
    });

    setTimeout(() => {
      router.push('/');
    }, 1500);
  } else {
    handleException(response.code);
    
    handleToast(response.status, exception);
  }

  isLoading.value = false;
};

const validateForm = (event) => {
  event.preventDefault();

  if (!formData.name || !formData.email || !formData.password) {
    handleToast('error', 'Preencha todos os campos.');
    return;
  } 
  
  register();
};

const { signUp } = useAuth();
const { handleException, exception } = useException();
const { toast, toastData, handleToast } = useToast();
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen text-primary-font p-7">
    <header class="flex flex-col items-start w-full">
      <Heading
        size="lg"
        text="Bem-vindo 👋"
        class="mt-4"
      />

      <Text 
        size="md"
        text="Cadastre-se e participe agora mesmo!"
        class="mt-1"
      />
    </header>

    <form
      @submit="validateForm"
      class="flex flex-col gap-4 items-stretch w-full mt-10"
    >
      <div class="flex flex-col gap-3">
        <label class="font-semibold">
          Nome e sobrenome
        </label>

        <TextInput
          v-model="formData.name"
          type="text"
          icon="UserIcon"
          text="Fulano de Tal"
        />
      </div>

      <div class="flex flex-col gap-3">
        <label class="font-semibold">
          Endereço de e-mail
        </label>

        <TextInput
          v-model="formData.email"
          type="email"
          icon="EnvelopeIcon"
          text="fulano@email.com"
        />
      </div>

      <div class="flex flex-col gap-3">
        <label class="font-semibold">
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
        text="Cadastrar na plataforma"
        :is-loading="isLoading"
        class="mt-4"
      />

      <GoogleButton />
    </form>

    <footer class="flex flex-col items-center gap-4 mt-8">
      <router-link to="/forgot">
        <Text
          :size="'sm'"
          :text="'Esqueceu sua senha?'"
          class="text-primary cursor-pointer hover:text-brand-hover hover:underline"
        />
      </router-link>

      <router-link to="/signin">
        <Text
          size="sm"
          text="Já possui conta?"
          class="text-primary cursor-pointer hover:text-gray-200"
        />

        <Text
          size="sm"
          text=" Entre agora!"
          class="text-primary cursor-pointer hover:text-brand-hover hover:underline"
        />
      </router-link>
    </footer>

    <Toast
      ref="toast"
      :toast-data="toastData"
    />
  </div>
</template>