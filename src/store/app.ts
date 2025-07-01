// src/store/app.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ILanguage, IToast } from '@/interfaces/app'

export const useAppStore = defineStore('app', () => {
	const toast = ref<IToast | null>(null)
	const languages: ILanguage[] = [
		{
			code: 'GB',
			label: 'English',
			locale: 'en-US',
		},
		{
			code: 'IT',
			label: 'Italiano',
			locale: 'it-IT',
		}
	]

	const applang = ref<ILanguage>(
		{
			code: 'GB',
			label: 'English',
			locale: 'en-US',
		}
	)

	function setLanguage(lang: ILanguage) {
		applang.value = languages.find((l) => l.code === lang.code) || applang.value
	}

	function notify(toastdata: IToast) {
		toast.value = toastdata
	}

	return {
		applang,
		languages,
		setLanguage,
		notify,
		toast
	}
}, {
  persist: true 
})

