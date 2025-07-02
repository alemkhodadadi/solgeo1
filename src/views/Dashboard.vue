<template>
  <PageHeader>
    <template #actions>
      <Button icon="pi pi-refresh" class="p-button-sm" @click="refresh" />
      <Button label="New Report" icon="pi pi-plus" class="p-button-sm p-button-primary" />
    </template>
  </PageHeader>

  <!-- Main content below -->
  <div class="p-4">
    <!-- Your content here -->
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/views/components/PageHeader.vue'

const refresh = () => {
  console.log('Refreshing...')
}
</script>