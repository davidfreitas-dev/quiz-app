<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <RouterLink
    :to="`/quiz/${quiz.id}`"
    :class="[
      'quiz flex items-center justify-between gap-4 p-5 w-full rounded-lg bg-white shadow-lg border-l-4 transition',
      quiz.score && quiz.score >= 0 ? 'border-success' : 'border-primary'
    ]"
  >
    <div class="flex flex-col flex-1 pl-2">
      <span class="text-lg font-bold text-dark">
        {{ quiz.description }}
      </span>
      <span class="text-sm text-gray-500 font-light mt-1">
        {{ quiz.questions.length }} questões
      </span>
    </div>

    <CheckCircleIcon
      v-if="quiz.score && quiz.score >= 0"
      class="w-6 h-6 text-success"
    />
    <ChevronRightIcon
      v-else
      class="w-5 h-5 text-primary"
    />
  </RouterLink>
</template>
