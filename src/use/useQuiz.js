import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { collection, query, where, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useQuizStore } from '@/stores/quizStore';
import { useStorage } from '@/use/useStorage';
import { useToast } from '@/use/useToast';

export function useQuiz() {
  const route = useRoute();
  const router = useRouter();
  const quizStore = useQuizStore();

  const { getStorage } = useStorage();
  const { toastData, handleToast } = useToast();
  const { quiz, isLoading } = storeToRefs(quizStore);
  const { loadQuizById } = quizStore;

  const user = ref(undefined);
  const userAnswers = ref([]);
  const currentQuestionIndex = ref(0);
  const isQuizDone = ref(false);
  const score = ref(0);

  const isLastQuestion = computed(() => currentQuestionIndex.value === quiz.value.questions.length - 1);
  
  const currentQuestion = computed(() => {
    if (!quiz.value || !quiz.value.questions) return null;
    return quiz.value.questions[currentQuestionIndex.value];
  });
  
  const progress = computed(() => {
    const total = quiz.value.questions.length;
    return (100 / total) * (currentQuestionIndex.value + 1);
  });

  const getUser = () => {
    user.value = getStorage('user');
  };

  const checkQuizDone = async () => {
    const q = query(
      collection(db, 'results'),
      where('idquiz', '==', Number(route.params.id)),
      where('iduser', '==', user.value.id)
    );
    const querySnapshot = await getDocs(q);
    let quizData = null;

    for (const docSnap of querySnapshot.docs) {
      quizData = docSnap.data();
    }

    isQuizDone.value = !!quizData;

    if (quizData?.answers.length) {
      for (const question of quiz.value.questions) {
        const answer = quizData.answers.find((a) => a.id === question.id);
        for (const option of question.options) {
          option.selected = option.option === answer.option;
        }
      }
    }
  };

  const fetchQuiz = async () => {
    const quizId = Number(route.params.id);
    await loadQuizById(quizId);
    await checkQuizDone();
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

  const saveData = async () => {
    const docRef = doc(collection(db, 'results'));
    await setDoc(docRef, {
      answers: userAnswers.value,
      idquiz: quiz.value.id,
      iduser: user.value.id,
      score: score.value,
    });
  };

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    } else {
      router.push('/');
    }
  };

  const nextQuestion = async () => {
    const hasSelectedOption = currentQuestion.value.options.some((option) => option.selected);

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

  const getOptionClass = (option, checked) => {
    const base = 'flex items-center gap-2 px-5 w-full h-14 rounded-2xl transition-colors text-dark';
    const selectedClass = checked ? 'bg-primary-light text-primary' : 'bg-light';
    const correctAnswerClass =
      isQuizDone.value && option.option === currentQuestion.value.answer
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
