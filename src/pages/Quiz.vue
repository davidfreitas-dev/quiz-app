<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useQuizzesStore } from '@/stores/quizzes';
import { useToast } from '@/use/useToast';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import Progressbar from '@/components/Progressbar.vue';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Actions from '@/components/Actions.vue';
import Toast from '@/components/Toast.vue';

const route = useRoute();
const router = useRouter();
const quizzesStore = useQuizzesStore();

const quiz = ref(undefined);

const loadQuiz = () => {
  const quizId = Number(route.params.id);
  
  quiz.value = quizzesStore.quizzes.find(quiz => quiz.id === quizId);
};

onMounted(() => {
  loadQuiz();
});

const currentQuestionIndex = ref(0);

const selectOption = (index) => {
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
  const userId = localStorage.getItem('bdb.userId');
  const docSnap = await getDoc(doc(db, 'users', userId));  
  const userData = docSnap.exists() ? docSnap.data() : null;

  userData.quizzes.push({
    id: quiz.value.id,
    answers: userAnswers.value,
    score: score.value
  });

  await updateDoc(doc(db, 'users', userId), {
    quizzes: userData.quizzes
  });
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === quiz.value.questions.length - 1;
});

const nextQuestion = async () => {
  const currentQuestion = quiz.value.questions[currentQuestionIndex.value];

  const hasSelectedOption = currentQuestion.options.some(option => option.selected);

  if (!hasSelectedOption) {
    handleToast('error', 'Selecione uma opção antes de continuar');
    return;
  }

  if (!isLastQuestion.value) {
    currentQuestionIndex.value++;
  } else {
    await checkAnswers();
    await saveData();
    router.push(`/result/${quiz.value.id}`);
  }
};

const progress = computed(() => {
  const questionsCount = quiz.value.questions.length;

  return (100 / questionsCount) * (currentQuestionIndex.value + 1);
});

const { toast, toastData, handleToast } = useToast();
</script>

<template>
  <div
    v-if="quiz"
    class="quiz-container flex flex-col items-start w-full min-h-screen p-7"
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
          class="option flex items-center gap-2 px-5 w-full h-14 rounded-2xl transition-colors"
          :class="[ item.selected ? 'text-primary bg-primary-light' : 'text-primary-font bg-light' ]"
          @click="selectOption(index)"
        >
          <CheckCircleIcon
            v-if="item.selected"
            class="h-6 w-6"
          />

          <span
            v-else
            class="h-5 w-5 mr-1 border-2 border-secondary-font rounded-full"
          />

          <label class="ml-2 text-sm font-semibold">
            {{ item.desc }}
          </label>
        </div>
      </template>
    </div>

    <Actions
      :is-last-question="isLastQuestion"
      @on-handle-continue="nextQuestion"
      @on-handle-back="previousQuestion"
    />

    <Toast
      ref="toast"
      :toast-data="toastData"
    />
  </div>
</template>