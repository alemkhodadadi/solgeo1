<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { ref } from 'vue';

const appStore = useAppStore();
const selectedCountry = ref(appStore.applang);
const countries = ref(appStore.languages);

function changelang(lang) {
    appStore.setLanguage(lang.value)
    console.log('Selected language:', lang);
}
</script>

<template>
    <Select v-tooltip.bottom="{ value: $t('topbar.changelang')}" @change="changelang" v-model="selectedCountry" style="background-color: transparent;" :options="countries" optionLabel="name" placeholder="Select a Country" class="w-12 p-0 lan-select">
        <template #value="slotProps">
            <div class="flex items-center">
                <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 22px" />
            </div>
        </template>
        <template #option="slotProps">
            <div class="flex items-center">
                <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 22px" />
            </div>
        </template>
    </Select>
</template>