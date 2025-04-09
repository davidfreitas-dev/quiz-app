import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { useToast } from '@/use/useToast';

export function useQuiz() {
  const route = useRoute();
  const router = useRouter();
  const quizStore = useQuizStore();
  
  const { toast, toastData, handleToast } = useToast();
  const { quiz, isLoading, isQuizDone, quizResult } = storeToRefs(quizStore);
  const { fetchQuizById, fetchQuizResult, submitQuizResult } = quizStore;
  
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

  const markSelectedOptions = (questions, answers) => {
    if (!questions || !answers) return;
    for (const question of questions) {
      const answer = answers.find(a => a.id === question.id);
      for (const option of question.options) {
        option.selected = option.option === answer.option;
      }
    }
  };
  
  const markQuizAsCompleted = async (quizId) => {
    try {
      await fetchQuizResult(quizId);
  
      if (quizResult.value?.answers?.length) {
        isQuizDone.value = true;
        markSelectedOptions(quiz.value.questions, quizResult.value.answers);
      } else {
        isQuizDone.value = false;
      }
    } catch (error) {
      handleToast('error', 'Erro ao carregar o resultado do quiz. Tente novamente mais tarde.');
      console.error(error);
    }
  };  

  const fetchQuiz = async () => {
    const quizId = Number(route.params.id);
    try {
      await fetchQuizById(quizId);
      await markQuizAsCompleted(quizId);
    } catch (error) {
      handleToast('error', 'Erro ao carregar o quiz. Tente novamente mais tarde.');
      console.error(error);
    }
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

  const validateCurrentAnswer = () => {
    const hasSelectedOption = currentQuestion.value?.options?.some((option) => option.selected);
    
    if (!hasSelectedOption) {
      handleToast('error', 'Selecione uma opção antes de continuar');
      return false;
    }

    return true;
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

  const goToNextQuestion = async () => {
    if (!isQuizDone.value && !validateCurrentAnswer()) return;

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      return;
    }

    if (isQuizDone.value) {
      router.push('/');
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    try {
      selectOptionByValue(getCurrentSelectedOption());
      evaluateAnswers();
  
      await submitQuizResult({
        quizId: quiz.value.id,
        answers: userAnswers.value,
        score: score.value,
      });
  
      router.push(`/result/${quiz.value.id}`);
    } catch (error) {
      handleToast('error', 'Erro ao finalizar o quiz. Tente novamente mais tarde.');
      console.error(error);
    }
  };  

  const computeOptionClass = (option, checked) => {
    const baseClass =
      'flex justify-between items-center gap-2 px-3 w-full h-14 rounded-2xl shadow-sm transition-colors text-dark';
  
    const isCorrectAnswer =
      isQuizDone.value &&
      isCurrentQuestionReady.value &&
      option?.option === currentQuestion.value.answer;
  
    const isWrongSelected =
      isQuizDone.value &&
      checked &&
      !isCorrectAnswer;
  
    const selectedClass = !isQuizDone.value
      ? checked
        ? 'bg-primary-light text-primary'
        : 'bg-light'
      : '';
  
    const correctAnswerClass = isCorrectAnswer
      ? 'text-success bg-success-light'
      : '';
  
    const wrongAnswerClass = isWrongSelected
      ? 'text-red-400 bg-red-50'
      : '';
  
    return [baseClass, selectedClass, correctAnswerClass, wrongAnswerClass]
      .filter(Boolean)
      .join(' ')
      .trim();
  };    

  return {
    quiz,
    isQuizDone,
    isLoading,
    currentQuestionIndex,
    currentQuestion,
    isLastQuestion,
    progress,
    toastData,
    toast,
    fetchQuiz,
    selectOptionByValue,
    computeOptionClass,
    getCurrentSelectedOption,
    goToPreviousQuestion,
    goToNextQuestion,
  };
}
