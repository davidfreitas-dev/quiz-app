<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { useLoading } from '@/use/useLoading';

// UI Components
import ConfettiExplosion from 'vue-confetti-explosion';
import Container from '@/components/Container.vue';
import Button from '@/components/Button.vue';
import PageLoader from '@/components/PageLoader.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const quizResult = ref(null);
const resultScore = ref(0);
const rawPercentage = ref(0);
const finalPercentage = ref(0);

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

const showConfetti = ref(false);

watch(finalPercentage, (val) => {
  if (val >= 80) {
    showConfetti.value = true;
  }
});

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

const { isLoading, withLoading } = useLoading();

const calculatePercentage = (score, total) => total > 0 ? Math.round((score / total) * 100) : 0;


const loadData = async () => {
  quizResult.value = await quizStore.fetchQuizResult(route.params.id);

  if (!quizResult.value) return;

  finalPercentage.value = calculatePercentage(
    quizResult.value.score, 
    quizResult.value.answers.length
  );

  animateNumber(rawPercentage, finalPercentage.value);
  animateNumber(resultScore, quizResult.value.score);
};

onMounted(async () => {
  await withLoading(
    async () => {
      loadData();
    }, 
    'Não foi possível carregar o resultado do quiz. Tente novamente mais tarde.'
  );
});
</script>

<template>
  <div>
    <PageLoader :visible="isLoading" />
  
    <Container v-if="!isLoading">
      <ConfettiExplosion
        v-if="showConfetti"
        :stage-width="1200"
        :force="0.6"
        :particle-count="200"
        :colors="['#7b63dd', '#61cdb9', '#facc15', '#f87171']"
        class="fixed top-0 left-1/2 w-full h-full z-10"
      />

      <div v-if="quizResult" class="flex flex-col items-center justify-center mt-20 gap-6 text-center px-4">
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
              :stroke-dashoffset="282.74 - (282.74 * rawPercentage / 100)"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="text-xl font-bold">
              {{ rawPercentage }}%
            </div>
            <div class="text-sm text-gray-500">
              {{ quizResult.score }} de {{ quizResult.answers.length }}
            </div>
          </div>
        </div>
      
        <div class="bg-white text-success px-4 py-2 rounded-full shadow-lg border border-gray-100 text-sm font-bold">
          +{{ resultScore }} XP
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
  </div>
</template>