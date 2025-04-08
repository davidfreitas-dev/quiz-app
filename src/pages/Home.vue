<script setup>
// External libs
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';

// Internal composables
import { useAuth } from '@/use/useAuth';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';

// UI Components
import Container from '@/components/Container.vue';
import Header from '@/components/Header.vue';
import UserStats from '@/components/UserStats.vue';
import Text from '@/components/Text.vue';
import QuizCard from '@/components/QuizCard.vue';
import Loader from '@/components/Loader.vue';
import Actions from '@/components/Actions.vue';
import Toast from '@/components/Toast.vue';

// Router & stores
const router = useRouter();
const quizStore = useQuizStore();
const { logOut } = useAuth();
const { removeStorage } = useStorage();
const { toast, toastData, handleToast } = useToast();
const { user, quizzes, isLoading, totalScore, completedCount } = storeToRefs(quizStore);

const signOut = async () => {
  const response = await logOut();
  if (response.status === 'success') {
    removeStorage('user');
    router.push('/signin');
  }
};

onMounted(async () => {
  await quizStore.fetchAllQuizzesWithScores();
});
</script>

<template>
  <Header :user="user">
    <template #user-stats>
      <UserStats
        v-if="!isLoading"
        :points="totalScore || 0"
        :ranking="7"
      />
    </template>
  </Header>

  <Container>
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
    >
      <Loader color="primary" />
    </div>

    <Text
      v-if="!isLoading && !quizzes.length"
      class="mx-auto my-7"
      text="Nenhum quizz disponível ainda :("
      size="md"
    />

    <div
      v-if="!isLoading && quizzes.length"
      class="quizzes flex flex-1 flex-col items-start w-full gap-3 my-7"
    >
      <Text
        class="leading-6"
        size="sm"
        weight="bold"
        text="Questionários"
      />

      <QuizCard
        v-for="(quiz, index) in quizzes"
        :key="index"
        :quiz="quiz"
      />
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
