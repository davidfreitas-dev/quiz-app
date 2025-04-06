import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useStorage } from '@/use/useStorage';

export const useQuizStore = defineStore('quiz', () => {
  const user = ref(null);
  const quiz = ref(null);
  const quizzes = ref([]);
  const isLoading = ref(true);
  const isQuizDone = ref(false);

  const initUser = () => {
    user.value = useStorage().getStorage('user');
  };

  initUser();

  const totalScore = computed(() =>
    quizzes.value.reduce((acc, quiz) => acc + (quiz.score || 0), 0)
  );

  const completedCount = computed(() =>
    quizzes.value.filter(q => q.score >= 0).length
  );

  const withLoading = async (fn) => {
    isLoading.value = true;
    try {
      await fn();
    } catch (err) {
      console.error('Erro na operação:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const markSelectedOptions = (questions, answers) => {
    for (const question of questions) {
      const answer = answers.find(a => a.id === question.id);
      for (const option of question.options) {
        option.selected = option.option === answer.option;
      }
    }
  };

  const fetchQuizById = async (id) => {
    await withLoading(async () => {
      const q = query(collection(db, 'quizzes'), where('id', '==', Number(id)));
      const querySnapshot = await getDocs(q);
      quiz.value = querySnapshot.docs[0]?.data() || null;
    });
  };

  const fetchAllQuizzesWithScores = async () => {
    await withLoading(async () => {
      const quizSnapshot = await getDocs(collection(db, 'quizzes'));
      const quizList = quizSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userResults = await getDocs(query(
        collection(db, 'results'),
        where('iduser', '==', user.value.id)
      ));

      const resultMap = new Map();
      userResults.forEach(doc => {
        const { idquiz, score } = doc.data();
        resultMap.set(idquiz, score);
      });

      quizzes.value = quizList.map(quiz => ({
        ...quiz,
        score: resultMap.get(quiz.id) ?? null
      })).sort((a, b) => a.id - b.id);
    });
  };

  const markQuizAsCompleted = async (quizId, userId) => {
    try {
      const q = query(
        collection(db, 'results'),
        where('idquiz', '==', Number(quizId)),
        where('iduser', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const quizData = querySnapshot.docs[0]?.data() || null;

      isQuizDone.value = !!quizData;

      if (quizData?.answers?.length) {
        markSelectedOptions(quiz.value.questions, quizData.answers);
      }
    } catch (err) {
      console.error('Erro ao verificar conclusão do quiz:', err);
    }
  };

  const submitQuizResult = async ({ quizId, userId, userName, answers, score }) => {
    try {
      const docRef = doc(collection(db, 'results'));
      await setDoc(docRef, {
        idquiz: quizId,
        iduser: userId,
        name: userName,
        answers,
        score,
      });
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
    }
  };

  return {
    user,
    quiz,
    quizzes,
    isLoading,
    isQuizDone,
    totalScore,
    completedCount,
    initUser,
    fetchQuizById,
    fetchAllQuizzesWithScores,
    markQuizAsCompleted,
    submitQuizResult
  };
});
