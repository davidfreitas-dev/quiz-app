<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import Container from '@/components/Container.vue';
import Button from '@/components/Button.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const quiz = computed(() => quizStore.quizResult);

onMounted(async () => {
  await quizStore.fetchQuizResult(route.params.id);
  console.log(quiz.value);
});

const percentage = computed(() => {
  if (!quiz.value) return 0;
  const questionsCount = quiz.value.answers.length || 0;
  return Math.round((quiz.value.score / questionsCount) * 100);
});

const resultTitle = computed(() => {
  if (percentage.value < 50) return 'Não desista!';
  if (percentage.value < 80) return 'Você está quase lá!';
  return 'Excelente!';
});

const resultMessage = computed(() => {
  if (percentage.value < 50) return 'Estude mais da próxima vez e acerte todas!';
  if (percentage.value < 80) return 'Mais um pouco de dedicação e você vai arrasar!';
  return 'Você mandou muito bem! Continue assim e conquiste novos desafios!';
});
</script>

<template>
  <Container>
    <div v-if="quiz" class="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <div class="relative w-32 h-32">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#E5E7EB"
            stroke-width="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#61cdb9"
            stroke-width="10"
            fill="none"
            stroke-linecap="round"
            :stroke-dasharray="282.74"
            :stroke-dashoffset="282.74 - (282.74 * percentage / 100)"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-xl font-bold">
            {{ percentage }}%
          </div>
          <div class="text-sm text-gray-500">
            {{ quiz.score }} de {{ quiz.answers.length }}
          </div>
        </div>
      </div>
      
      <div class="bg-white text-success px-4 py-2 rounded-full shadow-lg border border-gray-100 text-sm font-bold">
        +25 XP
      </div>
      
      <div class="message">
        <h1 class="text-xl font-bold text-gray-800">
          {{ resultTitle }}
        </h1>
        <p class="text-gray-600">
          {{ resultMessage }}
        </p>
      </div>
      
      <Button size="block" @click="router.push('/')">
        Voltar ao início
      </Button>
    </div>
  </Container>
</template>