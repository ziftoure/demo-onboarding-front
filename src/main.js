import { createApp } from 'vue';

import './styles.css';
import 'mosha-vue-toastify/dist/style.css';
import '@fortawesome/fontawesome-free/js/all.js';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import QrCodeVue from 'qrcode.vue';
import Icon from './components/Icon.vue';

import router from './router.js';
import api from './plugins/api.js';
import App from './App.vue';
import QrCodeView from '@/components/QrCodeView.vue';
const app = createApp(App);

app.use(router);
app.use(api);

app.component('qrcode-vue', QrCodeVue);
app.component('QrCodeView', QrCodeView);
app.component('custom-loader', ClipLoader);
app.component('icon', Icon);

app.mount('#app');
