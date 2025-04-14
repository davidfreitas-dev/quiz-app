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
import ProgressCircle from '@/components/ProgressCircle.vue';
import Text from '@/components/Text.vue';
import QuizCard from '@/components/QuizCard.vue';
import PageLoader from '@/components/PageLoader.vue';
import Button from '@/components/Button.vue';
import Toast from '@/components/Toast.vue';

// Router & stores
const router = useRouter();
const quizStore = useQuizStore();
const { toast, toastData, handleToast } = useToast();
const { user, quizzes, isLoading, scoreSummary } = storeToRefs(quizStore);

onMounted(async () => {
  try {
    await quizStore.fetchAllQuizzesWithScores();
  } catch (error) {
    handleToast('error', 'Ocorreu um erro ao carregar os quizzes. Tente novamente mais tarde.');
  }
});
</script>

<template>
  <Header :user="user">
    <template #user-stats>
      <div class="flex justify-between items-start bg-white text-gray-800 shadow-lg p-5 w-full rounded-2xl">
        <div>
          <h3 class="text-lg font-bold">
            Média geral
          </h3>
          <span class="text-sm text-secondary">1 prova concluída</span>
        </div>
        <ProgressCircle :percentage="scoreSummary.percentage" :value="scoreSummary.average" />
      </div>
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
