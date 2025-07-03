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
      { label: 'menu.titles.dataExplorer', icon: 'pi pi-fw pi-chart-bar', to: `/projects/${projectStore.currentProject?._id}/data-explorer` },
      { label: 'menu.titles.analytics', icon: 'pi pi-fw pi-chart-line', to: `/projects/${projectStore.currentProject?._id}/analytics` },
      { label: 'menu.titles.alarms', icon: 'pi pi-fw pi-info-circle', to: `/projects/${projectStore.currentProject?._id}/alarms` },
      { label: 'menu.titles.tools', icon: 'pi pi-fw pi-wrench', to: `/projects/${projectStore.currentProject?._id}/tools` },
      { label: 'menu.titles.devices', icon: 'pi pi-fw pi-tablet', to: `/projects/${projectStore.currentProject?._id}/devices` },
      { label: 'menu.titles.repositories', icon: 'pi pi-fw pi-folder-open', to: `/projects/${projectStore.currentProject?._id}/repositories` },
      { label: 'menu.titles.settings', icon: 'pi pi-fw pi-cog', to: `/projects/${projectStore.currentProject?._id}/settings` },
      { label: 'menu.titles.reports', icon: 'pi pi-fw pi-file-pdf', to: `/projects/${projectStore.currentProject?._id}/reports` },
      { label: 'menu.titles.map', icon: 'pi pi-fw pi-map', to: `/projects/${projectStore.currentProject?._id}/map` }
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
