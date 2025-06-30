
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'
import './assets/styles.scss'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import i18n from './i18n'

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

const pinia = createPinia()
pinia.use(piniaPersistedState)
app.use(pinia)
app.use(i18n)
app.use(router)
app.use(ToastService);
app.mount('#app')
