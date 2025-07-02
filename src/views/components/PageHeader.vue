<template>
  <div class="card flex justify-between items-center px-4 py-3 border-b border-gray-200">
    <div class="font-semibold text-lg">
      {{ $t(pageTitle) }}
    </div>

    <div class="flex items-center space-x-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, type ComputedRef  } from 'vue'

const route = useRoute()

const pageTitle: ComputedRef<string> = computed(() => {
  const title = route.meta.title
  return typeof title === 'string' ? title : ''
})

</script>

<style scoped>
.page-header {
  background-color: var(--surface-ground);
}
</style>
