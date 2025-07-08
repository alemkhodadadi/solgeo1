
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'
import ConfirmationService from 'primevue/confirmationservice';
import './assets/styles.scss'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import i18n from './i18n'

import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersistedState)
app.use(pinia)
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


app.use(i18n)
app.use(router)
app.use(ToastService);
app.use(ConfirmationService);

app.component('Toast', Toast);

app.mount('#app')
