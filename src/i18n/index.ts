import { createI18n } from 'vue-i18n'
import en from './en'
import it from './it'

export const messages = {
  en,
  it,
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',        // default
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
})

export default i18n
