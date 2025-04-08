import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';

export function useQuiz() {
  const route = useRoute();
  const router = useRouter();
  const quizStore = useQuizStore();

  const { getStorage } = useStorage();
  const { toast, toastData, handleToast } = useToast();
  const { quiz, isLoading, isQuizDone } = storeToRefs(quizStore);
  const { fetchQuizById, markQuizAsCompleted, submitQuizResult } = quizStore;

  const user = ref(undefined);
  const userAnswers = ref([]);
  const currentQuestionIndex = ref(0);
  const score = ref(0);

  const questions = computed(() => quiz.value?.questions || []);
  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null);
  const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);
  const progress = computed(() => (100 / questions.value.length) * (currentQuestionIndex.value + 1));

  const isCurrentQuestionReady = computed(() => {
    return (
      currentQuestion.value &&
      Array.isArray(currentQuestion.value.options) &&
      typeof currentQuestion.value.answer !== 'undefined'
    );
  });

  const loadUserFromStorage = () => {
    user.value = getStorage('user');
  };

  const fetchQuiz = async () => {
    const quizId = Number(route.params.id);
    await fetchQuizById(quizId);
    await markQuizAsCompleted(quizId, user.value.id);
  };

  const selectOptionByValue = (value) => {
    if (isQuizDone.value) return;
    currentQuestion.value.options.forEach((option) => {
      option.selected = option.option === value;
    });
  };

  const getCurrentSelectedOption = () => {
    const selected = currentQuestion.value.options.find((o) => o.selected);
    return selected ? selected.option : null;
  };

  const evaluateAnswers = () => {
    score.value = 0;
    userAnswers.value = [];

    for (const question of questions.value) {
      const selected = question.options.find((o) => o.selected);
      if (selected) {
        if (selected.option === question.answer) score.value++;
        userAnswers.value.push({
          id: question.id,
          option: selected.option,
          desc: selected.desc,
        });
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    } else {
      router.push('/');
    }
  };

  const validateCurrentAnswer = () => {
    const hasSelectedOption = currentQuestion.value?.options?.some((option) => option.selected);
    
    if (!hasSelectedOption) {
      handleToast('error', 'Selecione uma opção antes de continuar');
      return false;
    }

    return true;
  };

  const finishQuiz = async () => {
    evaluateAnswers();

    await submitQuizResult({
      quizId: quiz.value.id,
      userId: user.value.id,
      userName: user.value.name,
      answers: userAnswers.value,
      score: score.value,
    });

    router.push(`/result/${quiz.value.id}`);
  };

  const goToNextQuestion = async () => {
    if (!isQuizDone.value && !validateCurrentAnswer()) return;

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      return;
    }

    if (isQuizDone.value) {
      router.push('/');
      return;
    }

    await finishQuiz();
  };


  const computeOptionClass = (option, checked) => {
    const baseClass =
      'flex justify-between items-center gap-2 px-5 w-full h-14 rounded-2xl shadow-sm transition-colors text-dark';
  
    const isCorrectAnswer =
      isQuizDone.value &&
      isCurrentQuestionReady.value &&
      option?.option === currentQuestion.value.answer;
  
    const selectedClass = checked
      ? 'bg-primary-light text-primary'
      : 'bg-light';
  
    const correctAnswerClass = isCorrectAnswer
      ? 'text-success bg-success-light'
      : '';
  
    return [baseClass, selectedClass, correctAnswerClass].join(' ').trim();
  };  

  return {
    // refs
    quiz,
    user,
    isQuizDone,
    isLoading,
    currentQuestionIndex,
    currentQuestion,
    isLastQuestion,
    progress,
    toastData,
    toast,
    // methods
    loadUserFromStorage,
    fetchQuiz,
    selectOptionByValue,
    getCurrentSelectedOption,
    goToPreviousQuestion,
    goToNextQuestion,
    computeOptionClass,
  };
}
