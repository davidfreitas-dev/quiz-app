<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuth } from '@/use/useAuth';
import { useToast } from '@/use/useToast';

import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import GoogleButton from '@/components/GoogleButton.vue';
import Loader from '@/components/Loader.vue';

const router = useRouter();
const userStore = useUserStore();
const { isLoading, signUp } = useAuth();
const { showToast } = useToast();

const formData = reactive({
  name: '',
  email: '',
  password: ''
});

const invalidForm = computed(() => !formData.name || !formData.email || !formData.password);

const register = async (event) => {
  event.preventDefault();

  if (invalidForm.value) return;

  const response = await signUp(formData);

  try {
    await userStore.saveUser({
      id: response.data.uid,
      email: response.data.email,
      name: formData.name
    });
    router.push('/');
  } catch (error) {
    console.log('Error: ', error);
    showToast('error', 'Não foi possível concluir o cadastro. Tente novamente mais tarde.');
  }
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
        text="Cadastre-se e participe agora mesmo!"
        class="mt-1"
      />
    </header>

    <form class="flex flex-col gap-4 items-stretch w-full mt-10" @submit="register($event)">
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
          @on-keyup-enter="register($event)"
        />
      </div>

      <Button class="mt-4" :disabled="invalidForm">
        <Loader v-if="isLoading" />
        <span v-else>Cadastrar na plataforma</span>
      </Button>

      <GoogleButton />
    </form>

    <footer class="flex flex-col items-center gap-4 mt-8">
      <router-link to="/signin" class="text-primary cursor-pointer text-sm underline underline-offset-4">
        Acessar minha conta
      </router-link>
    </footer>
  </div>
</template>
