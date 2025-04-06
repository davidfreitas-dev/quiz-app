<script setup>
// External libs
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quizStore';

// Internal composables
import { useAuth } from '@/use/useAuth';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';

// UI Components
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import Container from '@/components/Container.vue';
import Heading from '@/components/Heading.vue';
import UserStats from '@/components/UserStats.vue';
import Avatar from '@/components/Avatar.vue';
import Text from '@/components/Text.vue';
import Loader from '@/components/Loader.vue';
import Actions from '@/components/Actions.vue';
import Toast from '@/components/Toast.vue';

// Router & stores
const router = useRouter();
const quizStore = useQuizStore();
const { logOut } = useAuth();
const { removeStorage } = useStorage();
const { toast, toastData, handleToast } = useToast();

// Reativos da store (como computed para manter a reatividade)
const user = computed(() => quizStore.user);
const quizzes = computed(() => quizStore.quizzes);
const isLoading = computed(() => quizStore.isLoading);
const totalScore = computed(() => quizStore.totalScore);
const completedCount = computed(() => quizStore.completedCount);

const firstName = computed(() => {
  return user.value?.name?.split(' ')[0] || 'Visitante';
});

const signOut = async () => {
  const response = await logOut();
  if (response.status === 'success') {
    removeStorage('user');
    router.push('/signin');
  }
};

onMounted(async () => {
  await quizStore.loadQuizzes();
});
</script>

<template>
  <Container>
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
    >
      <Loader color="primary" />
    </div>

    <div
      v-if="!isLoading && user"
      class="flex justify-between items-center w-full mb-5"
    >
      <div class="flex flex-col items-start">
        <Heading
          size="lg"
          :text="`👋 Olá ${firstName},`"
        />

        <Text
          text="É bom vê-lo novamente!"
          class="text-center mt-1"
        />
      </div>

      <Avatar :image="user?.image" />
    </div>

    <UserStats
      v-if="!isLoading"
      :points="totalScore || 0"
      :ranking="32" 
    />

    <Text
      v-if="!isLoading && !quizzes.length"
      text="Nenhuma prova no sistema ainda :("
      class="text-center"
    />

    <div
      v-if="!isLoading && quizzes.length"
      class="quizzes flex flex-1 flex-col items-start w-full gap-3"
    >
      <template
        v-for="(quiz, index) in quizzes"
        :key="index"
      >
        <router-link        
          :to="`/quiz/${quiz.id}`"
          class="quiz flex items-center justify-between gap-2 p-5 w-full text-dark rounded-2xl bg-light cursor-pointer"
        >
          <label class="text-sm font-semibold">
            Prova {{ quiz.id }} <span v-if="quiz.score >= 0"> ({{ quiz.score }} Pontos)</span>
          </label>

          <span
            v-if="quiz.score >= 0"
            class="text-success text-sm font-semibold"
          >
            Concluída
          </span>
        
          <ChevronRightIcon
            v-else
            class="h-5 w-5"
          />
        </router-link>
      </template>
    </div>

    <Actions
      v-if="!isLoading"
      class="mt-5"
      text-left="Sair"
      text-right="Ranking"
      @on-handle-left="signOut"
      @on-handle-right="router.push('/ranking')"
    />
    
    <Toast
      ref="toast"
      :toast-data="toastData"
    />
  </Container>
</template>
