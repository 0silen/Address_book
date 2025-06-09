// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ContactView from './views/ContactView.vue';

const routes = [
  {
    path: '/',
    name: 'ContactView',
    component: ContactView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;