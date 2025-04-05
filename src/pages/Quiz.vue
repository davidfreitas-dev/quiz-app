<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { collection, query, where, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import Container from '@/components/Container.vue';
import Progressbar from '@/components/Progressbar.vue';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Loader from '@/components/Loader.vue';
import Actions from '@/components/Actions.vue';
import Toast from '@/components/Toast.vue';

const route = useRoute();

const user = ref(undefined);

const getUser = () => {
  user.value = getStorage('user');
};

const isQuizDone = ref(false);

const checkQuizDone = async () => {
  let quizData = null;

  const q = query(
    collection(db, 'results'), 
    where('idquiz', '==', Number(route.params.id)), 
    where('iduser', '==', user.value.id)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    quizData = doc.data();
  });
  
  isQuizDone.value = quizData ? true : false;

  if (isQuizDone.value) {
    if (!quizData.answers.length) return;

    quiz.value.questions.forEach(question => {
      const answer = quizData.answers.find(a => a.id === question.id);
      
      question.options.forEach(option => {
        if (option.option === answer.option) {
          option.selected = true;
        }
      });
    });
  }
};

const quiz = ref(undefined);

const isLoading = ref(true);

const getQuiz = async () => {
  const quizId = Number(route.params.id);
  
  const q = query(collection(db, 'quizzes'), where('id', '==', quizId));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    quiz.value = doc.data();
  });

  await checkQuizDone();

  isLoading.value = false;
};

onMounted(async () => {
  getUser();
  getQuiz();
});

const currentQuestionIndex = ref(0);

const selectQuizOption = (index) => {
  if (isQuizDone.value) return;

  const currentQuestion = quiz.value.questions[currentQuestionIndex.value];

  currentQuestion.options.forEach(option => {
    option.selected = false;
  });

  currentQuestion.options[index].selected = true;
};

const score = ref(0);

const userAnswers = ref([]);

const checkAnswers = async () => {
  quiz.value.questions.forEach(question => {
    question.options.forEach(option => {
      if (option.selected) {
        if (option.option === question.answer) {
          score.value++;
        }

        userAnswers.value.push({
          id: question.id,
          option: option.option,
          desc: option.desc
        });
      }
    });
  });
};

const saveData = async () => {
  const docRef = doc(collection(db, 'results'));

  await setDoc(docRef, {
    answers: userAnswers.value,
    idquiz: quiz.value.id,
    iduser: user.value.id,
    score: score.value
  });
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    return;
  }

  router.push('/');
};

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === quiz.value.questions.length - 1;
});

const router = useRouter();

const nextQuestion = async () => {
  const currentQuestion = quiz.value.questions[currentQuestionIndex.value];

  const hasSelectedOption = currentQuestion.options.some(option => option.selected);

  if (!isQuizDone.value && !hasSelectedOption) {
    handleToast('error', 'Selecione uma opção antes de continuar');
    return;
  }

  if (!isLastQuestion.value) {
    currentQuestionIndex.value++;
    return;
  } 
  
  if (isQuizDone.value) {
    router.push('/');
    return;
  }

  await checkAnswers();
  await saveData();

  router.push(`/result/${quiz.value.id}`);
};

const progress = computed(() => {
  const questionsCount = quiz.value.questions.length;

  return (100 / questionsCount) * (currentQuestionIndex.value + 1);
});

const { getStorage } = useStorage();
const { toast, toastData, handleToast } = useToast();
</script>

<template>
  <Container>
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center w-full h-screen"
    >
      <Loader color="primary" />
    </div>

    <div
      v-if="!isLoading && quiz"
      class="quiz-container flex flex-col items-start w-full"
    >
      <Text
        class="mb-5"
        size="sm"
        weight="semibold"
        :text="`Prova ${quiz.id} - Questão ${quiz.questions[currentQuestionIndex].id} de ${quiz.questions.length}`"
      />

      <Progressbar
        class="mb-5"
        :progress="progress"
      />

      <Heading
        class="mb-5"
        size="md"
        weight="bold"
        :text="quiz.questions[currentQuestionIndex].question"
      />

      <div class="options flex flex-1 flex-col items-start w-full gap-3">
        <template
          v-for="(item, index) in quiz.questions[currentQuestionIndex].options"
          :key="index"
        >
          <div
            class="option flex items-center gap-2 px-5 w-full h-14 rounded-2xl transition-colors text-dark bg-light"
            :class="{ 
              'text-primary bg-primary-light': item.selected,
              'text-success bg-success-light': item.option === quiz.questions[currentQuestionIndex].answer && isQuizDone,
            }"
            @click="selectQuizOption(index)"
          >
            <CheckCircleIcon
              v-if="item.selected"
              class="h-6 w-6"
            />

            <span
              v-else
              class="h-5 w-5 mr-1 border-2 border-secondary-light rounded-full"
              :class="{ 'border-success border-opacity-20': item.option === quiz.questions[currentQuestionIndex].answer && isQuizDone }"
            />

            <label class="ml-2 text-sm font-semibold">
              {{ item.desc }}
            </label>
          </div>
        </template>
      </div>

      <Actions
        class="mt-5"
        :text-left="currentQuestionIndex === 0 ? 'Voltar' : 'Anterior'"
        :text-right="isLastQuestion ? 'Finalizar' : 'Próxima'"
        @on-handle-left="previousQuestion"
        @on-handle-right="nextQuestion"
      />

      <Toast
        ref="toast"
        :toast-data="toastData"
      />
    </div>
  </Container>
</template>