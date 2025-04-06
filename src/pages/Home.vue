<script setup>
// 1. External libs
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, where, getDocs } from 'firebase/firestore';

// 2. Internal services & composables
import { db } from '@/services/firebase-firestore';
import { useAuth } from '@/use/useAuth';
import { useToast } from '@/use/useToast';
import { useStorage } from '@/use/useStorage';

// 3. UI components
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import Container from '@/components/Container.vue';
import Heading from '@/components/Heading.vue';
import UserStats from '@/components/UserStats.vue';
import Avatar from '@/components/Avatar.vue';
import Text from '@/components/Text.vue';
import Loader from '@/components/Loader.vue';
import Actions from '@/components/Actions.vue';

// 4. Composables
const router = useRouter();
const { logOut } = useAuth();
const { getStorage, removeStorage } = useStorage();
const { toast, toastData, handleToast } = useToast();

const user = ref(null);
const quizzes = ref([]);
const isLoading = ref(true);

const firstName = computed(() => {
  return user.value?.name?.split(' ')[0] || 'Visitante';
});

const checkQuizzes = async () => {
  if (!user.value) return;

  try {
    const q = query(collection(db, 'results'), where('iduser', '==', user.value.id));
    const querySnapshot = await getDocs(q);

    const userQuizzes = [];
    querySnapshot.forEach((doc) => {
      userQuizzes.push(doc.data());
    });

    if (userQuizzes.length) {
      const quizMap = new Map(userQuizzes.map(el => [el.idquiz, el.score]));
      quizzes.value.forEach(quiz => {
        if (quizMap.has(quiz.id)) {
          quiz.score = quizMap.get(quiz.id);
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar quizzes do usuário: ', error);
    handleToast('error', 'Não foi possível carregar os quizzes. Tente novamente mais tarde.');
  }
};


const fetchQuizzes = async () => {
  const querySnapshot = await getDocs(collection(db, 'quizzes'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })).sort((a, b) => a.id - b.id);
};

const loadQuizzes = async () => {
  quizzes.value = await fetchQuizzes();
  await checkQuizzes();
  isLoading.value = false;
};

const signOut = async () => {
  const response = await logOut();
  if (response.status === 'success') {
    removeStorage('user');
    router.push('/signin');
  }
};

onMounted(async () => {
  user.value = getStorage('user');
  await loadQuizzes();
});
</script>

<template>
  <Container>
    <div class="flex justify-between items-center w-full mb-5">
      <div class="flex flex-col items-start">
        <Heading
          size="lg"
          :text="`👋 Olá ${firstName},`"
        />

        <Text
          text="É bom vê-lo novamente!"
          class="text-center mt-1"
        />
      </div>

      <Avatar :image="user?.image" />
    </div>

    <UserStats
      :points="2300"
      :ranking="32"
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
      class="mt-5"
      text-left="Sair"
      text-right="Ranking"
      @on-handle-left="signOut"
      @on-handle-right="router.push('/ranking')"
    />
    
    <Toast
      ref="toast"
      :toast-data="toastData"
    />
  </Container>
</template>
