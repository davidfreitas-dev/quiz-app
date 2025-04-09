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
      throw err;
    } finally {
      isLoading.value = false;
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

  const submitQuizResult = async ({ quizId, answers, score }) => {
    await withLoading(async () => {
      const docRef = doc(collection(db, 'results'));
      await setDoc(docRef, {
        idquiz: quizId,
        iduser: user.value.id,
        name: user.value.name,
        answers,
        score,
      });
    });
  };    

  const fetchQuizResult = async (quizId) => {
    await withLoading(async () => {
      const q = query(
        collection(db, 'results'),
        where('idquiz', '==', Number(quizId)),
        where('iduser', '==', user.value.id)
      );
  
      const querySnapshot = await getDocs(q);
  
      quizResult.value = querySnapshot.docs[0]?.data() || null;
    });
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
    submitQuizResult,
    fetchQuizResult,
    fetchUsersAndResults
  };
});
