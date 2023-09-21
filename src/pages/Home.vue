<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import { useUserStore } from '@/stores/user';
import { useQuizzesStore } from '@/stores/quizzes';
import { useAuth } from '@/use/useAuth';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Loader from '@/components/Loader.vue';
import Actions from '@/components/Actions.vue';

const userStore = useUserStore();

const quizzes = ref([]);

const checkQuizzes = async () => {
  const user = userStore.user;

  if (user && user.quizzes.length) {
    user.quizzes.forEach(el => {
      quizzes.value.forEach(quiz => {
        if (quiz.id === el.id) {
          quiz.score = el.score;
        }
      });
    });
  }  
};

const getQuizzes = async () => {
  let data = [];

  const querySnapshot = await getDocs(collection(db, 'quizzes'));

  querySnapshot.forEach((doc) => {
    data.push({
      ...{ id: doc.id },
      ...doc.data()
    });
  });

  quizzes.value = data.sort((a, b) => a.id - b.id);

  checkQuizzes();
};

const isLoading = ref(true);

const quizzesStore = useQuizzesStore();

onMounted(async () => {
  await getQuizzes();
  quizzesStore.setQuizzes(quizzes.value);
  isLoading.value = false;
});

const router = useRouter();

const selectQuiz = (quiz) => {
  if (quiz.score >= 0) return;
  
  router.push(`/quiz/${quiz.id}`);
};

const signOut = async () => {
  const response = await logOut();
  
  if (response.status == 'success') {
    router.push('/signin');
  }
};

const { logOut } = useAuth();
</script>

<template>
  <div class="flex flex-col items-start gap-5 w-full min-h-screen p-7">
    <Heading
      size="md"
      text="Selecione a prova que deseja iniciar."
    />

    <div
      v-if="isLoading"
      class="flex-1 flex flex-col items-center justify-center w-full"
    >
      <Loader color="primary" />
    </div>

    <Text
      v-if="!isLoading && !quizzes.length"
      text="Nenhuma prova no sistema ainda :("
      class="text-center"
    />

    <div
      v-if="!isLoading && quizzes.length"
      class="quizzes flex flex-1 flex-col items-start w-full gap-3"
    >
      <div
        v-for="(quiz, index) in quizzes"
        :key="index"
        class="quiz flex items-center justify-between gap-2 p-5 w-full text-primary-font rounded-2xl bg-light cursor-pointer"
        @click="selectQuiz(quiz)"
      >
        <label class="text-sm font-semibold">
          Prova {{ quiz.id }} <span v-if="quiz.score >= 0"> ({{ quiz.score }} Pontos)</span>
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

    <Actions
      text-left="Sair"
      text-right="Ranking"
      @on-handle-left="signOut"
      @on-handle-right="router.push('/ranking')"
    />
  </div>
</template>
