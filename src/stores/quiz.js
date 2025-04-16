import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { collection, doc, addDoc, setDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useUserStore } from '@/stores/user'; 

export const useQuizStore = defineStore('quiz', () => {
  const quiz = ref(null);
  const quizzes = ref([]);
  const quizResult = ref(null);
  const allUsers = ref([]);
  const allResults = ref([]);
  const usersResults = ref([]);
  const isQuizDone = ref(false);
  const isLoading = ref(true);

  const { user } = storeToRefs(useUserStore()); 

  const totalScore = computed(() =>
    quizzes.value.reduce((acc, quiz) => acc + (quiz.score || 0), 0)
  );

  const completedCount = computed(() =>
    quizzes.value.filter(q => q.score >= 0).length
  );

  const scoreSummary = computed(() => {
    const completedQuizzes = quizzes.value.filter(q => q.score != null);
    const totalScore = completedQuizzes.reduce((acc, quiz) => acc + quiz.score, 0);  
    const totalQuestions = completedQuizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
    const averageScore = completedQuizzes.length > 0 ? Math.round(totalScore / completedQuizzes.length) : 0;
    const percentage = totalQuestions > 0 
      ? Math.round((totalScore / totalQuestions) * 100) 
      : 0;
  
    return {
      average: averageScore,
      percentage
    };
  });   

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
      
      for (const user of usersList) {
        const userResults = resultsList.filter(result => result.iduser === user.id);
        user.score = userResults.reduce((acc, r) => acc + (r.score || 0), 0);
      }
  
      allUsers.value = usersList;
      allResults.value = resultsList;
      
      usersResults.value = [...usersList]
        .map(user => ({
          ...user,
          image: user.image || new URL('@/assets/user.png', import.meta.url).href
        }))
        .sort((a, b) => b.score - a.score);
    });
  };  

  const fetchAllQuizzesWithScores = async () => {
    await withLoading(async () => {
      const quizSnapshot = await getDocs(collection(db, 'quizzes'));
      const quizList = [];
  
      // Para cada quiz, também buscar as perguntas na subcoleção
      for (const quizDoc of quizSnapshot.docs) {
        const quizData = quizDoc.data();
        const quizId = quizDoc.id;
        
        // Busca as perguntas na subcoleção 'questions'
        const questionsSnapshot = await getDocs(collection(db, `quizzes/${quizId}/questions`));
        const questions = questionsSnapshot.docs.map(doc => doc.data());
  
        quizList.push({
          id: quizId,
          ...quizData,
          questions,  // Adiciona as perguntas ao quiz
        });
      }
  
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
  
      console.log('QUIZ: ', quiz.value);
    });
  };    

  const fetchQuizResult = async (quizId) => {
    await withLoading(async () => {      
      const resultsSnapshot = await getDocs(
        query(
          collection(db, 'results'),
          where('idquiz', '==', Number(quizId)),
          where('iduser', '==', user.value.id)
        )
      );
  
      if (resultsSnapshot.empty) {
        console.warn('Nenhum resultado encontrado.');
        return;
      }
  
      const resultDoc = resultsSnapshot.docs[0];
      const resultData = resultDoc.data();
      const resultId = resultDoc.id;
  
      const answersSnapshot = await getDocs(collection(resultDoc.ref, 'answers'));
  
      if (answersSnapshot.empty) {
        console.warn('Nenhuma resposta encontrada.');
        return;
      }
  
      const answers = answersSnapshot.docs
        .sort((a, b) => Number(a.idquestion) - Number(b.idquestion))
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
      const resultRef = doc(collection(db, 'results'));
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
    allUsers,
    allResults,
    usersResults,
    isLoading,
    isQuizDone,
    totalScore,
    completedCount,
    scoreSummary,
    fetchUsersAndResults,
    fetchAllQuizzesWithScores,
    fetchQuizById,
    fetchQuizResult,
    saveQuiz,
    submitQuizResult
  };
});
