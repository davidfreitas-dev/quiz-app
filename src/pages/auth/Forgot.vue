<script setup>
import { ref } from 'vue';
import { useAuth } from '@/use/useAuth';
import { useException } from '@/use/useException';
import { useToast } from '@/use/useToast';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import Toast from '@/components/Toast.vue';

const isLoading = ref(false);

const email = ref('');

const handleRecover = async () => {
  isLoading.value = true;

  const response = await passwordReset(email.value);

  if (response.status == 'success') {
    handleToast(response.status, response.message);
  } else {
    handleException(response.code);
    handleToast(response.status, exception);
  }

  isLoading.value = false;
};

const validateForm = (event) => {
  event.preventDefault();

  if (!email.value) {
    handleToast('error', 'Informe seu e-mail.');
    return;
  }
  
  handleRecover();
};

const { passwordReset } = useAuth();
const { handleException, exception } = useException();
const { toast, toastData, handleToast } = useToast();
</script>

<template>
  <div class="flex flex-col w-full text-primary-font p-7">
    <header class="flex flex-col items-start">
      <Heading
        size="lg"
        text="Bem-vindo 👋"
        class="mt-4"
      />

      <Text 
        size="md"
        text="Recupere sua senha usando seu e-mail"
        class="mt-1"
      />
    </header>

    <form
      @submit="validateForm"
      class="flex flex-col gap-4 items-stretch w-full max-w-sm mt-10"
    >
      <div class="flex flex-col gap-3">
        <label
          class="font-semibold"
          for="lblEmail"
        >
          Endereço de e-mail
        </label>

        <TextInput
          v-model="email"
          type="email"
          icon="EnvelopeIcon"
          text="johndoe@email.com"
          @on-keyup-enter="validateForm"
        />
      </div>

      <Button
        text="Enviar link de recuperação"
        is-loading="isLoading"
        class="mt-4"
      />
    </form>

    <footer class="flex flex-col items-center gap-4 mt-8">
      <router-link to="/signin">
        <Text
          size="sm"
          text="Voltar para a tela de login"
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