import { createRouter, createWebHashHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: '/result/:id',
      name: 'result',
      component: () => import('../pages/Result.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../pages/Ranking.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/Profile.vue'),
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
  const userStore = useUserStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getCurrentUser();
    if (user) {
      await userStore.fetchUserData(user.uid);
      next();
    } else {
      next('/signin');
    }
  } else {
    next();
  }
});

export default router;