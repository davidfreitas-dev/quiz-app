<script setup>
import { useRouter } from 'vue-router';
import { CheckCircleIcon, ChevronRightIcon, XCircleIcon } from '@heroicons/vue/24/solid';

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
    class="quiz flex items-center justify-between gap-4 p-5 w-full rounded-lg bg-white shadow-lg border-l-4 transition cursor-pointer"
    :class="[
      quiz.done ? 'border-success' : !quiz.available ? 'border-red-400' : 'border-primary',
      !quiz.available && !quiz.done ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
    ]"
  >
    <div class="flex flex-col flex-1 pl-2">
      <span class="text-lg font-bold text-dark leading-5">
        {{ quiz.description }}
      </span>
      <span class="text-sm text-secondary font-normal mt-1">
        {{ quiz.totalQuestions }} questões
      </span>
    </div>

    <CheckCircleIcon
      v-if="quiz.done"
      class="w-6 h-6 text-success"
    />
    <XCircleIcon
      v-else-if="!quiz.available"
      class="w-6 h-6 text-red-400"
    />
    <ChevronRightIcon
      v-else
      class="w-5 h-5 text-primary"
    />
  </div>
</template>
