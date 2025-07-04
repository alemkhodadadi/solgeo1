<script setup lang="ts">
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()

// Define the type for each menu item
interface MenuItem {
  label?: string
  icon?: string
  to?: string
  url?: string
  target?: string
  items?: MenuItem[]
  separator?: boolean
  class?: string
}

const model = ref<MenuItem[]>([
  {
    label: 'menu.titles.home',
    items: [
      { label: 'menu.titles.dashboard', icon: 'pi pi-fw pi-home', to: `/projects/${projectStore.currentProject?._id}/dashboard` },
      { label: 'menu.titles.dataNavigation', icon: 'pi pi-fw pi-chart-bar', to: `/projects/${projectStore.currentProject?._id}/data-navigation` },
      { label: 'menu.titles.analysis', icon: 'pi pi-fw pi-chart-line', to: `/projects/${projectStore.currentProject?._id}/analysis` },
      { label: 'menu.titles.alarms', icon: 'pi pi-fw pi-info-circle', to: `/projects/${projectStore.currentProject?._id}/alarms` },
      { label: 'menu.titles.reports', icon: 'pi pi-fw pi-file-pdf', to: `/projects/${projectStore.currentProject?._id}/reports` }
    ]
  }
])
</script>


<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="i">
      <AppMenuItem v-if="!item.separator" :item="item" :index="i" />
      <li v-else class="menu-separator"></li>
    </template>
  </ul>
</template>
