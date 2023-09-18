<script setup>
import { ref, onMounted } from 'vue';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import { useQuizzesStore } from '@/stores/quizzes';
import Text from '@/components/Text.vue';

const quizzesStore = useQuizzesStore();

const quizzes = ref([
  {
    id: 1,
    questions: [
      {
        id: 1,
        question: 'Qual é a capital da França?', 
        options: [
          { option: 'A', desc: 'Londres', selected: false }, 
          { option: 'B', desc: 'Paris', selected: false }, 
          { option: 'C', desc: 'Berlim', selected: false }, 
          { option: 'D', desc: 'Madrid', selected: false }
        ], 
        answer: 'B'
      },
      { 
        id: 2,
        question: 'Quem escreveu "Romeu e Julieta"?',
        options: [
          { option: 'A', desc: 'Charles Dickens', selected: false }, 
          { option: 'B', desc: 'Jane Austen', selected: false }, 
          { option: 'C', desc: 'Leo Tolstoy', selected: false }, 
          { option: 'D', desc: 'William Shakespeare', selected: false }
        ], 
        answer: 'D'
      }
    ]
  }
]);

onMounted(() => {
  quizzesStore.setQuizzes(quizzes.value);
});
</script>

<template>
  <div class="flex flex-col items-start gap-5 w-full min-h-screen p-7">
    <Text
      size="lg"
      weight="bold"
      text="Selecione a prova que deseja fazer para iniciar o teste."
    />

    <div class="quizzes flex flex-1 flex-col items-start w-full gap-3">
      <router-link
        v-for="(quiz, index) in quizzes"
        :key="index"
        :to="`/quiz/${quiz.id}`"
        class="quiz flex items-center justify-between gap-2 p-5 w-full text-font rounded-2xl bg-light cursor-pointer"
      >
        <label class="ml-2 text-sm font-semibold">
          Prova {{ quiz.id }}
        </label>
        
        <ChevronRightIcon class="h-5 w-5" />
      </router-link>
    </div>
  </div>
</template>
