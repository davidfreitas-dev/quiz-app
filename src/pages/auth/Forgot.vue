<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '@/use/useAuth';
import { useException } from '@/use/useException';
import { useToast } from '@/use/useToast';

import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import Loader from '@/components/Loader.vue';

const { isLoading, passwordReset } = useAuth();

const email = ref('');

const invalidForm = computed(() => !email.value);

const { showToast } = useToast();

const requestPasswordReset = async (event) => {
  event.preventDefault();

  if (invalidForm.value) return;
  
  const response = await passwordReset(email.value);

  showToast(response.status, response.message);
};
</script>

<template>
  <div class="flex flex-col items-center md:justify-center mx-auto max-w-[450px] min-h-screen text-dark p-7">
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
      <router-link to="/signin" class="text-primary cursor-pointer text-sm underline underline-offset-4">
        Acessar minha conta
      </router-link>
    </footer>
  </div>
</template>