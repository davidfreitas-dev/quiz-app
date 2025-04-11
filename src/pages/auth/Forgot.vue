<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '@/use/useAuth';
import { useException } from '@/use/useException';

import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import Toast from '@/components/Toast.vue';
import Loader from '@/components/Loader.vue';

const { isLoading, toast, toastData, passwordReset } = useAuth();

const email = ref('');

const invalidForm = computed(() => !email.value);

const requestPasswordReset = async (event) => {
  event.preventDefault();

  if (invalidForm.value) return;
  
  await passwordReset(email.value);
};
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
        text="Recupere sua senha usando seu e-mail"
        class="mt-1"
      />
    </header>

    <form class="flex flex-col gap-4 items-stretch w-full mt-10" @submit="requestPasswordReset($event)">
      <div class="flex flex-col gap-3">
        <label class="font-semibold">
          Endereço de e-mail
        </label>

        <TextInput
          v-model="email"
          type="email"
          icon="EnvelopeIcon"
          text="johndoe@email.com"
          @on-keyup-enter="requestPasswordReset($event)"
        />
      </div>

      <Button class="mt-4" :disabled="invalidForm">
        <Loader v-if="isLoading" />
        <span v-else>Enviar link de recuperação</span>
      </Button>
    </form>

    <footer class="flex flex-col items-center gap-4 mt-8">
      <router-link to="/signin">
        <Text
          size="sm"
          text="Acessar minha conta"
          class="text-primary cursor-pointer text-brand-hover underline"
        />
      </router-link>
    </footer>

    <Toast ref="toast" :toast-data="toastData" />
  </div>
</template>