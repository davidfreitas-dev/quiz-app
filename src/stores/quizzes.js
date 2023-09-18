import { defineStore } from 'pinia';

export const useQuizzesStore = defineStore('quizzes', {
  state: () => ({
    quizzes: []
  }),
  actions: {
    setQuizzes(quizzes) {
      this.quizzes = quizzes;
    },
  },
});