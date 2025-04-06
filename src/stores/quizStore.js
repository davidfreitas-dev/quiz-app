import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useStorage } from '@/use/useStorage';

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref([]);
  const isLoading = ref(true);
  const user = ref(useStorage().getStorage('user'));

  const totalScore = computed(() =>
    quizzes.value.reduce((acc, quiz) => acc + (quiz.score || 0), 0)
  );

  const completedCount = computed(() =>
    quizzes.value.filter(q => q.score >= 0).length
  );

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
    } catch (err) {
      console.error('Erro ao carregar quizzes:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    quizzes,
    isLoading,
    user,
    totalScore,
    completedCount,
    loadQuizzes
  };
});
