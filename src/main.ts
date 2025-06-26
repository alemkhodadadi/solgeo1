
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles.scss'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.app-dark',
            cssLayer: false
        },
        unstyled: true
    }
 });
app.use(createPinia())
app.use(router)

app.mount('#app')
