import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quizStore';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';

export function useQuiz() {
  const route = useRoute();
  const router = useRouter();
  const quizStore = useQuizStore();

  const { getStorage } = useStorage();
  const { toastData, handleToast } = useToast();
  const { quiz, isLoading, isQuizDone } = storeToRefs(quizStore);
  const { loadQuizById, checkQuizDone, saveQuizResult } = quizStore;

  const user = ref(undefined);
  const userAnswers = ref([]);
  const currentQuestionIndex = ref(0);
  const score = ref(0);

  const isLastQuestion = computed(() => currentQuestionIndex.value === quiz.value?.questions.length - 1);
  
  const currentQuestion = computed(() => {
    return quiz.value?.questions?.[currentQuestionIndex.value] || null;
  });
  
  const progress = computed(() => {
    const total = quiz.value?.questions?.length || 1;
    return (100 / total) * (currentQuestionIndex.value + 1);
  });

  const getUser = () => {
    user.value = getStorage('user');
  };

  const fetchQuiz = async () => {
    const quizId = Number(route.params.id);
    await loadQuizById(quizId);
    await checkQuizDone(quizId, user.value.id);
  };

  const selectQuizOptionByValue = (value) => {
    if (isQuizDone.value) return;
    currentQuestion.value.options.forEach((option) => {
      option.selected = option.option === value;
    });
  };

  const getCurrentSelectedOption = () => {
    const selected = currentQuestion.value.options.find((o) => o.selected);
    return selected ? selected.option : null;
  };

  const checkAnswers = async () => {
    for (const question of quiz.value.questions) {
      for (const option of question.options) {
        if (option.selected) {
          if (option.option === question.answer) score.value++;
          userAnswers.value.push({
            id: question.id,
            option: option.option,
            desc: option.desc,
          });
        }
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    } else {
      router.push('/');
    }
  };

  const nextQuestion = async () => {
    const hasSelectedOption = currentQuestion.value?.options?.some((option) => option.selected);
  
    const isDone = isQuizDone?.value;
  
    if (!isDone && !hasSelectedOption) {
      handleToast('error', 'Selecione uma opção antes de continuar');
      return;
    }
  
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      return;
    }
  
    if (isDone) {
      router.push('/');
      return;
    }
  
    checkAnswers();
  
    await saveQuizResult({
      quizId: quiz.value.id,
      userId: user.value.id,
      userName: user.value.name,
      answers: userAnswers.value,
      score: score.value
    });
  
    router.push(`/result/${quiz.value.id}`);
  };  

  const getOptionClass = (option, checked) => {
    const base = 'flex items-center gap-2 px-5 w-full h-14 rounded-2xl transition-colors text-dark';
    const selectedClass = checked ? 'bg-primary-light text-primary' : 'bg-light';
  
    const isCurrentQuestionReady =
      currentQuestion.value &&
      Array.isArray(currentQuestion.value.options) &&
      typeof currentQuestion.value.answer !== 'undefined';
  
    const isDone = isQuizDone?.value;
  
    const correctAnswerClass =
      isDone &&
      isCurrentQuestionReady &&
      option?.option === currentQuestion.value.answer
        ? 'text-success bg-success-light'
        : '';
  
    return `${base} ${selectedClass} ${correctAnswerClass}`;
  };
  
  return {
    quiz,
    user,
    isQuizDone,
    isLoading,
    currentQuestionIndex,
    currentQuestion,
    isLastQuestion,
    progress,
    toastData,
    getUser,
    fetchQuiz,
    selectQuizOptionByValue,
    getCurrentSelectedOption,
    previousQuestion,
    nextQuestion,
    getOptionClass,
  };
}
