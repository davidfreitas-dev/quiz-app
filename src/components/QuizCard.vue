<script setup>
import { useRouter } from 'vue-router';
import { CheckCircleIcon, ArrowRightCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToQuiz = () => {
  if (props.quiz.available || props.quiz.done) {
    router.push(`/quiz/${props.quiz.id}`);
  }
};
</script>

<template>
  <div
    @click="goToQuiz"
    class="relative flex items-center justify-between w-full p-5 pl-6 pr-4 gap-4 rounded-xl shadow-lg transition cursor-pointer"
    :class="[
      quiz.done ? 'bg-success-light' : !quiz.available ? 'bg-red-100' : 'bg-primary-light',
      !quiz.available && !quiz.done ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
    ]"
  >
    <!-- Faixa lateral colorida -->
    <div
      class="absolute left-0 h-[65%] my-auto w-1.5 rounded-r-xl"
      :class="quiz.done ? 'bg-success' : !quiz.available ? 'bg-red-400' : 'bg-primary'"
    />

    <div class="flex flex-col flex-1">
      <!-- Título com cor dinâmica -->
      <span
        class="text-base font-bold leading-tight"
        :class="quiz.done ? 'text-success' : !quiz.available ? 'text-red-400' : 'text-primary'"
      >
        {{ quiz.description }}
      </span>

      <!-- Número de questões -->
      <span class="text-sm text-secondary font-medium mt-1">
        {{ quiz.totalQuestions }} questões
      </span>

      <!-- Score com badge -->
      <span
        class="inline-block w-max text-xs font-semibold mt-2 px-3 py-1 rounded-full text-white"
        :class="quiz.done
          ? 'bg-success'
          : !quiz.available
            ? 'bg-red-400'
            : 'bg-primary'"
      >
        {{ quiz.done
          ? `${quiz.score} Pontos`
          : !quiz.available
            ? 'Indisponível'
            : 'Disponível' }}
      </span>
    </div>

    <!-- Ícones de status -->
    <CheckCircleIcon
      v-if="quiz.done"
      class="w-6 h-6 text-success"
    />
    <XCircleIcon
      v-else-if="!quiz.available"
      class="w-6 h-6 text-red-400"
    />
    <ArrowRightCircleIcon
      v-else
      class="w-6 h-6 text-primary"
    />
  </div>
</template>
