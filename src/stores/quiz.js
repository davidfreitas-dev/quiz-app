import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { collection, doc, addDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useUserStore } from '@/stores/user'; 

export const useQuizStore = defineStore('quiz', () => {
  const quiz = ref(null);
  const quizzes = ref([]);
  const quizResult = ref(null);
  const usersResults = ref([]);
  const isQuizDone = ref(false);
  const isLoading = ref(true);

  const userStore = useUserStore();

  const { user } = storeToRefs(userStore);

  const withLoading = async (fn) => {
    isLoading.value = true;
    try {
      return await fn();
    } catch (err) {
      console.error('Erro na requisição:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getCollectionDocs = async (path) => {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data()
    }));
  };
  
  const getUserResults = async () => {
    await userStore.fetchUser();

    const userId = user.value.id;
    const resultsRef = collection(db, 'users', userId, 'results');
    const snapshot = await getDocs(resultsRef);
  
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const fetchUsersAndResults = async () => {
    await withLoading(async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
  
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        score: 0,
        results: []
      }));
      
      await Promise.all(
        users.map(async user => {
          const snapshot = await getDocs(collection(db, `users/${user.id}/results`));
  
          const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
  
          user.score = results.reduce((total, r) => total + (r.score || 0), 0);
          
          user.results = results;
        })
      );
  
      usersResults.value = users
        .map(user => ({
          ...user,
          image: user.image || new URL('@/assets/user.png', import.meta.url).href
        }))
        .sort((a, b) => b.score - a.score);
    });
  };
  
  const fetchQuizzes = async () => {
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
  
    const quizzesList = await Promise.all(
      quizzesSnapshot.docs.map(async doc => {
        const questions = await getCollectionDocs(`quizzes/${doc.id}/questions`);
        return {
          id: doc.id,
          ...doc.data(),
          totalQuestions: questions.length,
        };
      })
    );
  
    quizzes.value = quizzesList.sort((a, b) => a.id - b.id);
    
    return quizzes.value;
  };  

  const fetchQuizById = async (quizId) => {
    await withLoading(async () => {
      const quizzesSnapshot = await getDocs(
        query(collection(db, 'quizzes'), where('id', '==', quizId))
      );
  
      if (quizzesSnapshot.empty) {
        throw new Error('Quiz não encontrado');
      }
  
      const quizDoc = quizzesSnapshot.docs[0];
      const quizDocRef = doc(db, 'quizzes', quizDoc.id);
      const questionsSnapshot = await getDocs(query(collection(quizDocRef, 'questions')));
  
      if (questionsSnapshot.empty) {
        throw new Error('Nenhuma pergunta encontrada para este quiz');
      }
  
      const questions = questionsSnapshot.docs
        .sort((a, b) => Number(a.id) - Number(b.id)) // ordena pelo ID do documento
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
      quiz.value = {
        ...quizDoc.data(),
        questions
      };
    });
  };    

  const fetchQuizResult = async (quizId) => {
    await withLoading(async () => {
      await userStore.fetchUser();

      const resultsQuery = query(
        collection(db, `users/${user.value.id}/results`),
        where('idquiz', '==', Number(quizId))
      );
  
      const resultsSnapshot = await getDocs(resultsQuery);

      if (resultsSnapshot.empty) {
        console.warn('Nenhum resultado encontrado.');
        quizResult.value = null;
        return;
      }
  
      const resultDoc = resultsSnapshot.docs[0];
      const resultData = resultDoc.data();
      const resultId = resultDoc.id;
  
      const answersSnapshot = await getDocs(collection(resultDoc.ref, 'answers'));
  
      const answers = answersSnapshot.docs
        .sort((a, b) => Number(a.data().question_id) - Number(b.data().question_id))
        .map(doc => doc.data());
  
      quizResult.value = {
        id: resultId,
        ...resultData,
        answers
      };
    });
  };  

  const saveQuiz = async (quizData) => {
    await withLoading(async () => {
      await addDoc(collection(db, 'quizzes'), quizData);
    });
  };

  const submitQuizResult = async ({ quizId, answers, score }) => {
    await withLoading(async () => {
      await userStore.fetchUser();
      
      const userRef = doc(db, 'users', user.value.id);
      const resultRef = doc(collection(userRef, 'results'));

      await setDoc(resultRef, {
        idquiz: quizId,
        iduser: user.value.id,
        score
      });
  
      for (const answer of answers) {
        await setDoc(doc(collection(resultRef, 'answers'), String(answer.id)), {
          idquestion: answer.id,
          option: answer.option
        });
      }
    });
  };

  return {
    user,
    quiz,
    quizzes,
    quizResult,
    usersResults,
    isLoading,
    isQuizDone,
    getUserResults,
    fetchUsersAndResults,
    fetchQuizzes,
    fetchQuizById,
    fetchQuizResult,
    saveQuiz,
    submitQuizResult
  };
});
