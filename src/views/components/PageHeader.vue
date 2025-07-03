<template>
  <div class="card flex justify-between items-center px-4 py-3 border-b border-gray-200">
    <div class="flex flex-col">
      <div class="font-semibold text-lg">
        {{ $t(pageMeta.title) }}
      </div>
      <div  class="text-base text-muted-color">
        {{ $t(pageMeta.description) }}
      </div>
    </div>

    <div v-if="slots.actions" class="flex items-center space-x-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, type ComputedRef, onMounted, useSlots  } from 'vue'

const slots = useSlots()
const route = useRoute()



const pageMeta = computed(() => {
  const meta = route.meta

  return {
    title: typeof meta.title === 'string' ? meta.title : '',
    description: typeof meta.description === 'string' ? meta.description : '',
    requiresAuth: meta.requiresAuth === true,
    requiredRoles: Array.isArray(meta.requiredRoles) ? meta.requiredRoles : [],
    // Add more fallbacks as needed
    ...meta // include everything raw too
  }
})

onMounted(() => {
  console.log(pageMeta)
})

</script>
