<script setup>
import Progressbar from '@/components/Progressbar.vue';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';

const props = defineProps({
  quizId: {
    type: Number,
    default: 0
  },
  questionId: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 1
  },
  questionText: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  }
});
</script>

<template>
  <div class="mb-5 w-full">
    <Text
      size="sm"
      weight="semibold"
      :text="`Prova ${quizId} - Questão ${questionId} de ${totalQuestions}`"
    />
    <Progressbar
      class="my-5"
      :progress="progress"
    />
    <Heading
      size="md"
      weight="bold"
      :text="questionText"
    />
  </div>
</template>
