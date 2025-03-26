import './style.css';
import App from './App.vue';
import { createApp } from 'vue';
import router from './router/router';
import './services/registerSW';

const app = createApp(App);

// Registro del Vue Router a la app
app.use(router);

app.mount('#app');