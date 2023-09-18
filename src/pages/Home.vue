<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import { useQuizzesStore } from '@/stores/quizzes';
import { db } from '@/services/firebase-firestore';
import Heading from '@/components/Heading.vue';

const quizzesStore = useQuizzesStore();

const quizzes = ref([]);

const loadQuizzes = async () => {
  let data = [];

  const querySnapshot = await getDocs(collection(db, 'quizzes'));

  querySnapshot.forEach((doc) => {
    data.push({
      ...{ id: doc.id },
      ...doc.data()
    });
  });

  quizzes.value = data;
};

onMounted(async () => {
  await loadQuizzes();
  quizzesStore.setQuizzes(quizzes.value);
});
</script>

<template>
  <div class="flex flex-col items-start gap-5 w-full min-h-screen p-7">
    <Heading
      size="md"
      text="Selecione a prova que deseja fazer para iniciar o teste."
    />

    <div class="quizzes flex flex-1 flex-col items-start w-full gap-3">
      <router-link
        v-for="(quiz, index) in quizzes"
        :key="index"
        :to="`/quiz/${quiz.id}`"
        class="quiz flex items-center justify-between gap-2 p-5 w-full text-primary-font rounded-2xl bg-light cursor-pointer"
      >
        <label class="ml-2 text-sm font-semibold">
          Prova {{ quiz.id }}
        </label>
        
        <ChevronRightIcon class="h-5 w-5" />
      </router-link>
    </div>
  </div>
</template>
