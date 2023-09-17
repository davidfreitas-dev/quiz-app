<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import Text from '@/components/Text.vue';

const router = useRouter();

const quizzes = ref([
  {
    id: 1,
    questions: [
      {
        id: 1,
        question: 'Qual é a capital da França?', 
        options: [
          { A: 'Londres', selected: false }, 
          { B: 'Paris', selected: false }, 
          { C: 'Berlim', selected: false }, 
          { D: 'Madrid', selected: false }
        ], 
        answer: 'B'
      },
      { 
        id: 2,
        question: 'Quem escreveu "Romeu e Julieta"?',
        options: [
          { A: 'Charles Dickens', selected: false }, 
          { B: 'Jane Austen', selected: false }, 
          { C: 'Leo Tolstoy', selected: false }, 
          { D: 'William Shakespeare', selected: false }
        ], 
        answer: 'D'
      }
    ]
  }
]);
</script>

<template>
  <div class="flex flex-col items-start gap-5 w-full min-h-screen p-7">
    <Text
      size="lg"
      weight="bold"
      text="Selecione a prova que deseja fazer para iniciar o teste."
    />

    <div class="quizzes flex flex-1 flex-col items-start w-full gap-3">
      <div
        v-for="(quiz, index) in quizzes"
        :key="index"
        class="quiz flex items-center justify-between gap-2 p-5 w-full text-font rounded-2xl bg-light cursor-pointer"
      >
        <label class="ml-2 text-sm font-semibold">
          Prova {{ quiz.id }}
        </label>
        <ChevronRightIcon class="h-5 w-5" />
      </div>
    </div>
  </div>
</template>
