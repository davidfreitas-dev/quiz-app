<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { useToast } from '@/use/useToast';

// UI Components
import ConfettiExplosion from 'vue-confetti-explosion';
import Container from '@/components/Container.vue';
import Button from '@/components/Button.vue';
import PageLoader from '@/components/PageLoader.vue';
import Toast from '@/components/Toast.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const quiz = computed(() => quizStore.quizResult);

const score = ref(0);
const percentage = ref(0);
const finalPercentage = ref(0);
const showConfetti = ref(false);

const { toast, toastData, handleToast } = useToast();

const isLoading = ref(true);

const withLoading = async (fn) => {
  isLoading.value = true;
  try {
    await fn();
  } catch (err) {
    console.error('Erro na requisição: ', err);
    handleToast('error', 'Ocorreu um erro ao carregar o resultado do quiz. Tente novamente mais tarde.');
  } finally {
    isLoading.value = false;
  }
};

const animateNumber = (targetRef, finalValue, formatFn = (v) => Math.round(v)) => {
  let currentValue = targetRef.value || 0;
  const increment = (finalValue - currentValue) / 30;

  let count = 0;
  const interval = setInterval(() => {
    currentValue += increment;
    targetRef.value = formatFn(currentValue);

    count++;
    if (count >= 30) {
      targetRef.value = formatFn(finalValue);
      clearInterval(interval);
    }
  }, 15);
};

onMounted(async () => {
  await withLoading(async () => {
    await quizStore.fetchQuizResult(route.params.id);
  });
  
  if (quiz.value) {
    const totalQuestions = quiz.value.answers.length || 0;
    finalPercentage.value = Math.round((quiz.value.score / totalQuestions) * 100);

    animateNumber(percentage, finalPercentage.value);
    animateNumber(score, quiz.value.score);

    setTimeout(() => {
      if (finalPercentage.value >= 80) {
        showConfetti.value = true;
      }
    }, 450);
  }
});

const resultTitle = computed(() => {
  if (finalPercentage.value < 50) return 'Não desista!';
  if (finalPercentage.value < 80) return 'Você está quase lá!';
  return 'Excelente!';
});

const resultMessage = computed(() => {
  if (finalPercentage.value < 50) return 'Estude mais da próxima vez e acerte todas!';
  if (finalPercentage.value < 80) return 'Mais um pouco de dedicação e você vai arrasar!';
  return 'Você mandou muito bem! Continue assim e aumente o seu conhecimento!';
});
</script>

<template>
  <PageLoader :visible="isLoading" />
  
  <Container v-if="!isLoading">
    <ConfettiExplosion
      v-if="showConfetti"
      :stage-width="1200"
      :force="0.6"
      :particle-count="200"
      :colors="['#7b63dd', '#61cdb9', '#facc15', '#f87171']"
      class="absolute top-0 left-0 w-full h-full z-10"
    />

    <div v-if="quiz" class="flex flex-col items-center justify-center mt-20 gap-6 text-center px-4">
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
        +{{ score }} XP
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

    <Toast ref="toast" :toast-data="toastData" />
  </Container>
</template>