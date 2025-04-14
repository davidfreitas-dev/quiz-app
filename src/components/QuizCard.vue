<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { CheckCircleIcon, ChevronRightIcon, XCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const isExpired = computed(() => {
  if (!props.quiz.deadline) return false;
  const deadline = new Date(props.quiz.deadline.seconds * 1000);
  return new Date() > deadline;
});

const isCompleted = computed(() => {
  return props.quiz.score !== null && typeof props.quiz.score !== 'undefined';
});

const goToQuiz = () => {
  if (!isExpired.value || isCompleted.value) {
    router.push(`/quiz/${props.quiz.id}`);
  }
};
</script>

<template>
  <div
    @click="goToQuiz"
    class="quiz flex items-center justify-between gap-4 p-5 w-full rounded-lg bg-white shadow-lg border-l-4 transition cursor-pointer"
    :class="[
      isCompleted ? 'border-success' : isExpired ? 'border-red-400' : 'border-primary',
      isExpired && !isCompleted ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
    ]"
  >
    <div class="flex flex-col flex-1 pl-2">
      <span class="text-lg font-bold text-dark leading-5">
        {{ quiz.description }}
      </span>
      <span class="text-sm text-secondary font-normal mt-1">
        {{ quiz.questions.length }} questões
      </span>
    </div>

    <CheckCircleIcon
      v-if="isCompleted"
      class="w-6 h-6 text-success"
    />
    <XCircleIcon
      v-else-if="isExpired"
      class="w-6 h-6 text-red-400"
    />
    <ChevronRightIcon
      v-else
      class="w-5 h-5 text-primary"
    />
  </div>
</template>
