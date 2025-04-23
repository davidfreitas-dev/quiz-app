<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/use/useAuth';

import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import GoogleButton from '@/components/GoogleButton.vue';
import Loader from '@/components/Loader.vue';

const router = useRouter();

const { isLoading, signIn } = useAuth();

const formData = reactive({
  email: '',
  password: ''
});

const invalidForm = computed(() => !formData.email || !formData.password);

const login = async (event) => {
  event.preventDefault();

  if (invalidForm.value) return;

  await signIn(formData);

  router.push('/');
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
        text="Entre e participe agora mesmo!"
        class="mt-1"
      />
    </header>

    <form class="flex flex-col gap-4 items-stretch w-full mt-10" @submit="login($event)">
      <div class="flex flex-col gap-3">
        <label class="font-semibold">
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
        <label class="font-semibold">
          Sua senha
        </label>

        <TextInput
          v-model="formData.password"
          type="password"
          icon="LockClosedIcon"
          text="**********"
          @on-keyup-enter="login($event)"
        />
      </div>

      <Button class="mt-4" :disabled="invalidForm">
        <Loader v-if="isLoading" />
        <span v-else>Entrar na plataforma</span>
      </Button>

      <GoogleButton />
    </form>

    <footer class="flex flex-col items-center gap-4 my-8 min-w-full">
      <router-link to="/forgot" class="text-primary cursor-pointer text-sm underline underline-offset-4">
        Esqueci minha senha
      </router-link>

      <router-link to="/signup" class="text-primary cursor-pointer text-sm underline underline-offset-4">
        Criar conta
      </router-link>
    </footer>
  </div>
</template>