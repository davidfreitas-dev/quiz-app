<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useAuth } from '@/use/useAuth';
import { useStorage } from '@/use/useStorage';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Loader from '@/components/Loader.vue';
import Actions from '@/components/Actions.vue';

const quizzes = ref([]);

const checkQuizzes = async () => {
  let userQuizzes = [];

  const user = getStorage('user');

  const q = query(collection(db, 'results'), where('iduser', '==', user.id));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    userQuizzes.push(doc.data());
  });

  if (userQuizzes.length) {
    userQuizzes.forEach(el => {
      quizzes.value.forEach(quiz => {
        if (quiz.id === el.idquiz) {
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
  
  isLoading.value = false;
};

const isLoading = ref(true);

onMounted(async () => {
  await getQuizzes();
});

const router = useRouter();

const signOut = async () => {
  const response = await logOut();
  
  if (response.status == 'success') {
    removeStorage('user');

    router.push('/signin');
  }
};

const { logOut } = useAuth();
const { getStorage, removeStorage } = useStorage();
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
      <template
        v-for="(quiz, index) in quizzes"
        :key="index"
      >
        <router-link        
          :to="`/quiz/${quiz.id}`"
          class="quiz flex items-center justify-between gap-2 p-5 w-full text-dark rounded-2xl bg-light cursor-pointer"
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
        </router-link>
      </template>
    </div>

    <Actions
      text-left="Sair"
      text-right="Ranking"
      @on-handle-left="signOut"
      @on-handle-right="router.push('/ranking')"
    />
  </div>
</template>
