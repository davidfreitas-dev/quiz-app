<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import { useQuizzesStore } from '@/stores/quizzes';
import { db } from '@/services/firebase-firestore';
import Heading from '@/components/Heading.vue';
import Button from '@/components/Button.vue';

const user = ref(undefined);

const getUser = async () => {
  const userId = localStorage.getItem('bdb.userId');
  const docSnap = await getDoc(doc(db, 'users', userId));  
  user.value = docSnap.exists() ? docSnap.data() : undefined;
};

const quizzesStore = useQuizzesStore();

const quizzes = ref([]);

const checkQuizzes = async () => {
  user.value.quizzes.forEach(el => {
    quizzes.value.forEach(quiz => {
      if (quiz.id === el.id) {
        quiz.score = el.score;
      }
    });
  });
};

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

  checkQuizzes();
};

onMounted(async () => {
  getUser();
  await loadQuizzes();
  quizzesStore.setQuizzes(quizzes.value);
});

const router = useRouter();

const selectQuiz = (quiz) => {
  if (quiz.score >= 0) return;
  
  router.push(`/quiz/${quiz.id}`);
};
</script>

<template>
  <div class="flex flex-col items-start gap-5 w-full min-h-screen p-7">
    <Heading
      size="md"
      text="Selecione a prova que deseja fazer para iniciar o teste."
    />

    <div class="quizzes flex flex-1 flex-col items-start w-full gap-3">
      <div
        v-for="(quiz, index) in quizzes"
        :key="index"
        class="quiz flex items-center justify-between gap-2 p-5 w-full text-primary-font rounded-2xl bg-light cursor-pointer"
        @click="selectQuiz(quiz)"
      >
        <label class="ml-2 text-sm font-semibold">
          Prova {{ quiz.id }} <span v-if="quiz.score >= 0">({{ quiz.score }})</span>
        </label>

        <span
          v-if="quiz.score >= 0"
          class="text-success text-sm font-semibold"
        >
          Concluída
        </span>
        
        <ChevronRightIcon
          v-else
          class="h-5 w-5"
        />
      </div>
    </div>

    <Button
      size="block"
      text="Ver ranking"
      @click="router.push('ranking')"
    />
  </div>
</template>
