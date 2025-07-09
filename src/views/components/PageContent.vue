<template>
    <div class="card flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <div v-if="slots.content" class="w-full">
            <slot name="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { computed, type ComputedRef, onMounted, useSlots } from 'vue';

    const slots = useSlots();
    const route = useRoute();
</script>

<style scoped></style>
