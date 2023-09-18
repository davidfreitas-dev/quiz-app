import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
      component: () => import('../pages/Home.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: () => import('../pages/Quiz.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../pages/Result.vue'),
      meta: {
        requiresAuth: true
      }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      getAuth(),
      (user) => {
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next('/signin');
    }
  } else {
    next();
  }
});

export default router;