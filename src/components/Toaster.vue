<template>
    <div class="toaster">
        <Toast id="api_toast" group="api" position="top-center"/>
        <Toast group="business" position="top-left"/>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAppStore } from '@/store/app';
import Toast from 'primevue/toast';
import type { IToast } from '@/interfaces/app';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const appStore = useAppStore();
const toastdata = ref<IToast | null>(null);
watch(() => appStore.toast, (newToast) => {
    if (newToast) {
        console.log('New toast data:', newToast);
        toast.add(newToast);
    }
});
</script>


<style>
#api_toast {
    top: 4rem !important;
}
</style>