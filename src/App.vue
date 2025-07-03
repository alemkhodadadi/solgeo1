<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAppStore } from '@/store/app'
import { useI18n } from 'vue-i18n'
import Toaster from '@/components/Toaster.vue'
import SolgeoSplash from './views/components/SolgeoSplash.vue'

const appStore = useAppStore()
const { locale } = useI18n()

locale.value = appStore.applang.locale

watch(() => appStore.applang, (newLang) => {
	console.log('Language changed to:', newLang)
  	locale.value = newLang.locale
})
onMounted(() => {
  appStore.setSplashScreen(false)
})
watch(
  () => appStore.splashScreenStatus,
  (newVal, oldVal) => {
    console.log('splashScreenStatus mode changed:', oldVal, '→', newVal)
  }
)



</script>

<template>
	<Toaster/>
	<SolgeoSplash v-if="appStore.splashScreenStatus"/>
  	<router-view v-else/>
</template>

<style scoped></style>
