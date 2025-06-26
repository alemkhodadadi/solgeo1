<script setup lang="ts">
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

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
    label: 'Home',
    items: [
			{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
			{ label: 'Data Explorer', icon: 'pi pi-fw pi-chart-bar', to: '/data-explorer' },
			{ label: 'Analytics', icon: 'pi pi-fw pi-chart-line', to: '/analytics' },
			{ label: 'Alarms', icon: 'pi pi-fw pi-info-circle', to: '/alarms' },
			{ label: 'Tools', icon: 'pi pi-fw pi-wrench', to: '/tools' },
			{ label: 'Devices', icon: 'pi pi-fw pi-tablet', to: '/devices' },
			{ label: 'Repositories', icon: 'pi pi-fw pi-folder-open', to: '/repositories' },
			{ label: 'Settings', icon: 'pi pi-fw pi-cog', to: '/settings' },
			{ label: 'Reports', icon: 'pi pi-fw pi-file-pdf', to: '/reports' },
      { label: 'Map', icon: 'pi pi-fw pi-map', to: '/map' }
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
