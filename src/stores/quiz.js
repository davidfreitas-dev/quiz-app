import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useStorage } from '@/use/useStorage';

export const useQuizStore = defineStore('quiz', () => {
  const user = ref(null);
  const quiz = ref(null);
  const quizzes = ref([]);
  const quizResult = ref(null);
  const allUsers = ref([]);
  const allResults = ref([]);
  const usersResults = ref([]);
  const isQuizDone = ref(false);
  const isLoading = ref(true);

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
      console.error('Erro ao salvar resultado: ', err);
    }
  };

  const fetchQuizResult = async (quizId) => {
    try {
      const q = query(
        collection(db, 'results'),
        where('idquiz', '==', Number(quizId)),
        where('iduser', '==', user.value.id)
      );

      const querySnapshot = await getDocs(q);

      quizResult.value = querySnapshot.docs[0]?.data() || null;
    } catch (err) {
      console.error('Erro ao obter resultado: ', err);
    }
  };

  const fetchUsersAndResults = async () => {
    await withLoading(async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const resultsSnapshot = await getDocs(collection(db, 'results'));
  
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        score: 0
      }));
  
      const resultsList = resultsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      // Soma dos scores
      for (const user of usersList) {
        const userResults = resultsList.filter(result => result.iduser === user.id);
        user.score = userResults.reduce((acc, r) => acc + (r.score || 0), 0);
      }
  
      allUsers.value = usersList;
      allResults.value = resultsList;
  
      // Ordenar ranking
      usersResults.value = [...usersList]
        .map(user => ({
          ...user,
          image: user.image || new URL('@/assets/user.png', import.meta.url).href
        }))
        .sort((a, b) => b.score - a.score);
    });
  };  

  return {
    user,
    quiz,
    quizzes,
    quizResult,
    allUsers,
    allResults,
    usersResults,
    isLoading,
    isQuizDone,
    totalScore,
    completedCount,
    initUser,
    fetchQuizById,
    fetchAllQuizzesWithScores,
    markQuizAsCompleted,
    submitQuizResult,
    fetchQuizResult,
    fetchUsersAndResults
  };
});
