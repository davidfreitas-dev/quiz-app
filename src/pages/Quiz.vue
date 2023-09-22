<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import Progressbar from '@/components/Progressbar.vue';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Actions from '@/components/Actions.vue';
import Toast from '@/components/Toast.vue';

const route = useRoute();

const quiz = ref(undefined);

const loadQuiz = async () => {
  const quizId = Number(route.params.id);
  
  const q = query(collection(db, 'quizzes'), where('id', '==', quizId));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    quiz.value = doc.data();
  });
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
  let user = getStorage('user');

  user.quizzes.push({
    id: quiz.value.id,
    answers: userAnswers.value,
    score: score.value
  });

  const totalScore = user.quizzes
    .map(quiz => quiz.score * 1)
    .reduce((total, current) => total + current, 0);

  user['score'] = totalScore;

  await updateDoc(doc(db, 'users', user.id), {
    quizzes: user.quizzes,
    score: totalScore
  });

  setStorage('user', user);
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === quiz.value.questions.length - 1;
});

const router = useRouter();

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

const { getStorage, setStorage } = useStorage();
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
      text-left="Anterior"
      :text-right="isLastQuestion ? 'Finalizar' : 'Próxima'"
      @on-handle-left="previousQuestion"
      @on-handle-right="nextQuestion"
    />

    <Toast
      ref="toast"
      :toast-data="toastData"
    />
  </div>
</template>