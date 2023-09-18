import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/signup', 
      name: 'signup',
      component: () => import('../pages/auth/SignUp.vue') 
    },
    { 
      path: '/signin', 
      name: 'signin',
      component: () => import('../pages/auth/SignIn.vue') 
    },
    { 
      path: '/forgot', 
      name: 'forgot',
      component: () => import('../pages/auth/Forgot.vue') 
    },
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
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

export default router;