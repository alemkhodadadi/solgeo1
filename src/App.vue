<script setup lang="ts">
import { watch } from 'vue'
import { useAppStore } from '@/store/app'
import { useI18n } from 'vue-i18n'
import Toaster from '@/components/Toaster.vue'

const app = useAppStore()
const { locale } = useI18n()

locale.value = app.applang.locale

watch(() => app.applang, (newLang) => {
	console.log('Language changed to:', newLang)
  	locale.value = newLang.locale
})

</script>

<template>
	<Toaster/>
  	<router-view />
</template>

<style scoped></style>
