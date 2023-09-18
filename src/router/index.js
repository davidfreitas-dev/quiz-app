import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/Home.vue')
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: () => import('../pages/Quiz.vue')
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../pages/Result.vue')
    },
  ]
});

export default router;