import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useStorage } from '@/use/useStorage';

export const useQuizStore = defineStore('quiz', () => {
  const user = ref(useStorage().getStorage('user'));
  const quiz = ref(null);
  const quizzes = ref([]);
  const isLoading = ref(true);
  const isQuizDone = ref(false);

  const totalScore = computed(() =>
    quizzes.value.reduce((acc, quiz) => acc + (quiz.score || 0), 0)
  );

  const completedCount = computed(() =>
    quizzes.value.filter(q => q.score >= 0).length
  );

  const loadQuizById = async (id) => {
    isLoading.value = true;
    try {
      const q = query(collection(db, 'quizzes'), where('id', '==', Number(id)));
      const querySnapshot = await getDocs(q);
  
      for (const docSnap of querySnapshot.docs) {
        quiz.value = docSnap.data();
      }

      console.log('Quiz selecionado: ', quiz.value);
    } catch (err) {
      console.error('Erro ao carregar quiz:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadQuizzes = async () => {
    isLoading.value = true;
    try {
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

      console.log('Quizzes carregados: ', quizzes.value);
    } catch (err) {
      console.error('Erro ao carregar quizzes:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const checkQuizDone = async (quizId, userId) => {
    try {
      const q = query(
        collection(db, 'results'),
        where('idquiz', '==', Number(quizId)),
        where('iduser', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      let quizData = null;

      for (const docSnap of querySnapshot.docs) {
        quizData = docSnap.data();
      }

      isQuizDone.value = !!quizData;

      if (quizData?.answers?.length) {
        for (const question of quiz.value.questions) {
          const answer = quizData.answers.find((a) => a.id === question.id);
          for (const option of question.options) {
            option.selected = option.option === answer.option;
          }
        }
      }
    } catch (err) {
      console.error('Erro ao verificar conclusão do quiz:', err);
    }
  };

  const saveQuizResult = async ({ quizId, userId, userName, answers, score }) => {
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
    totalScore,
    completedCount,
    loadQuizzes,
    loadQuizById,
    checkQuizDone,
    saveQuizResult
  };
});
