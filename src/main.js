import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './services/firebase-firestore';

import './style.css';

const app = createApp(App);

app.use(router);
app.mount('#app');
