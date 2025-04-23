<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { useUserStore } from '@/stores/user';
import { useLoading } from '@/use/useLoading';
import { useToast } from '@/use/useToast';

// UI Components
import Container from '@/components/Container.vue';
import Header from '@/components/Header.vue';
import ProgressCircle from '@/components/ProgressCircle.vue';
import Text from '@/components/Text.vue';
import QuizCard from '@/components/QuizCard.vue';
import Button from '@/components/Button.vue';
import PageLoader from '@/components/PageLoader.vue';

const router = useRouter();

const parseFirestoreDate = (date) => date?.toDate ? date.toDate() : new Date(date);

const enrichQuizWithStatus = (quiz, result) => {
  const now = new Date();
  const deadlineDate = parseFirestoreDate(quiz.deadline);

  return {
    ...quiz,
    done: !!result,
    score: result?.score || null,
    available: now <= deadlineDate,
  };
};

const quizStore = useQuizStore();

const quizzes = ref([]);

const loadQuizzesWithStatus = async () => {
  const fetchedQuizzes = await quizStore.fetchQuizzes();
  const userResults = await quizStore.getUserResults();
  const resultMap = Object.fromEntries(userResults.map(r => [r.idquiz, r]));
  quizzes.value = fetchedQuizzes.map(quiz => enrichQuizWithStatus(quiz, resultMap[quiz.id]));
};

const scoreSummary = computed(() => {
  const completedQuizzes = quizzes.value.filter(q => q.done);
  const totalScore = completedQuizzes.reduce((acc, quiz) => acc + quiz.score, 0);  
  const totalQuestions = completedQuizzes.reduce((acc, quiz) => acc + quiz.totalQuestions, 0);
  const averageScore = completedQuizzes.length > 0 ? Math.round(totalScore / completedQuizzes.length) : 0;
  const percentage = totalQuestions > 0 
    ? Math.round((totalScore / totalQuestions) * 100) 
    : 0;
  
  return {
    average: averageScore,
    completedQuizzes: completedQuizzes.length,
    percentage,
    totalScore
  };
});  

const userStore = useUserStore();
const { user } = storeToRefs(userStore); 
const { isLoading, withLoading } = useLoading();

const setupHome = async () => {
  await withLoading(async () => {
    await loadQuizzesWithStatus();
  });
};

onMounted(setupHome);
</script>

<template>
  <Header :user="user">
    <template #user-stats>
      <div class="flex justify-between items-start bg-white text-gray-800 shadow-lg p-5 max-w-[635px] mx-auto rounded-2xl">
        <div>
          <h3 class="text-lg font-bold">
            Média geral
          </h3>
          <span class="text-sm text-secondary">
            {{ scoreSummary.completedQuizzes }} 
            {{ scoreSummary.completedQuizzes === 1 ? 'prova concluída' : 'provas concluídas' }}
          </span>
        </div>
        <ProgressCircle :percentage="scoreSummary.percentage" :value="scoreSummary.average" />
      </div>
    </template>
  </Header>

  <PageLoader :visible="isLoading" />

  <Container v-if="!isLoading">
    <Text
      v-if="!quizzes.length"
      class="mx-auto my-7"
      text="Nenhum quizz disponível ainda :("
      size="md"
    />

    <div v-else class="quizzes flex flex-1 flex-col items-start w-full gap-5 my-7">
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
      size="block"
      @click="router.push('/ranking')"
    >
      Ranking
    </Button>
  </Container>
</template>

