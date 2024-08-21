import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home';
import RecevedInfos from '@/views/ReceivedInfos.vue';
import SelectFields from '@/views/SelectFields.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    
    { path: '/received-infos/:id', component: RecevedInfos },
    { path: '/', component: SelectFields },
    { path: '/qrcode', component: Home },
    { path: '/:notFound(.*)', redirect: '/' },
  ],
});

export default router;
