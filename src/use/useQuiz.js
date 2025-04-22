import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { useLoading } from '@/use/useLoading';
import { useToast } from '@/use/useToast';

export function useQuiz() {
  const route = useRoute();
  const router = useRouter();
  const quizStore = useQuizStore();
  
  const { showToast } = useToast();
  const { isLoading, withLoading } = useLoading();
  const { fetchQuizById, submitQuizResult } = quizStore;
  const { quiz } = storeToRefs(quizStore);
  
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
      const answer = answers.find(a => a.idquestion == question.id);
      for (const option of question.options) {
        option.selected = option.option === answer.option;
      }
    }
  };
  
  const fetchQuiz = async () => {
    const quizId = Number(route.params.id);
  
    await withLoading(
      async () => {
        await fetchQuizById(quizId);
        if (quiz.value?.done) {
          markSelectedOptions(quiz.value.questions, quiz.value.answers);
        }
      },
      'Erro ao carregar o quiz. Tente novamente mais tarde.'
    );
  };  

  const selectOptionByValue = (value) => {
    if (quiz.value?.done) return;
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
      showToast('error', 'Selecione uma opção antes de continuar');
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
    if (!quiz.value?.done && !validateCurrentAnswer()) return;

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      return;
    }

    if (quiz.value?.done) {
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
      showToast('error', 'Erro ao finalizar o quiz. Tente novamente mais tarde.');
      console.error(error);
    }
  };  

  const computeOptionClass = (option, checked) => {
    const baseClass =
      'flex justify-between items-center gap-2 px-3 w-full h-14 rounded-2xl shadow-sm transition-colors text-dark bg-light';
  
    const isCorrectAnswer =
      quiz.value?.done &&
      isCurrentQuestionReady.value &&
      option?.option === currentQuestion.value.answer;
  
    const isWrongSelected =
      quiz.value?.done &&
      checked &&
      !isCorrectAnswer;
  
    const selectedClass = !quiz.value?.done
      ? checked
        ? 'bg-primary-light text-primary'
        : ''
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
    currentQuestionIndex,
    currentQuestion,
    isLastQuestion,
    isLoading,
    progress,
    fetchQuiz,
    selectOptionByValue,
    computeOptionClass,
    getCurrentSelectedOption,
    goToPreviousQuestion,
    goToNextQuestion,
  };
}
