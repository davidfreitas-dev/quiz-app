<script setup>
// External libs
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';

// Internal composables
import { useToast } from '@/use/useToast';

// UI Components
import Container from '@/components/Container.vue';
import Header from '@/components/Header.vue';
import UserStats from '@/components/UserStats.vue';
import Text from '@/components/Text.vue';
import QuizCard from '@/components/QuizCard.vue';
import PageLoader from '@/components/PageLoader.vue';
import Button from '@/components/Button.vue';
import Toast from '@/components/Toast.vue';

// Router & stores
const router = useRouter();
const quizStore = useQuizStore();
const { toast, toastData, handleToast } = useToast();
const { user, quizzes, isLoading, totalScore } = storeToRefs(quizStore);

onMounted(async () => {
  try {
    await quizStore.fetchAllQuizzesWithScores();
  } catch (error) {
    handleToast({
      type: 'error',
      message: 'Ocorreu um erro ao carregar os quizzes. Tente novamente mais tarde.',
    });
  }
});
</script>

<template>
  <Header :user="user">
    <template #user-stats>
      <UserStats :points="totalScore || 0" :ranking="0" />
    </template>
  </Header>

  <Container>
    <PageLoader :visible="isLoading" />

    <Text
      v-if="!isLoading && !quizzes.length"
      class="mx-auto my-7"
      text="Nenhum quizz disponível ainda :("
      size="md"
    />

    <div v-if="!isLoading && quizzes.length" class="quizzes flex flex-1 flex-col items-start w-full gap-3 my-7">
      <Text
        class="leading-6 text-gray-900 mb-3"
        size="md"
        weight="bold"
        text="Questionários"
      />

      <QuizCard
        v-for="(quiz, index) in quizzes"
        :key="index"
        :quiz="quiz"
      />
    </div>

    <Button
      v-if="!isLoading"
      size="block"
      @click="router.push('/ranking')"
    >
      Ranking
    </Button>
    
    <Toast ref="toast" :toast-data="toastData" />
  </Container>
</template>
