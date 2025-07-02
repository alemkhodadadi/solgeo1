<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { computed, ref, watch } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppSidebar from './AppSidebar.vue';
import AppFooter from './AppFooter.vue';
import { useRoute } from 'vue-router'

const { layoutConfig, layoutState, openMenu, closeMenu } = useAppStore();
const route = useRoute()


// Explicitly type the event listener as a nullable function
const outsideClickListener = ref<((event: MouseEvent) => void) | null>(null);

const isSidebarActive = computed<boolean>(
    () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
);

// Watch sidebar visibility to bind/unbind click outside handler
watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const hideNavbar = computed(() => route.meta.hideNavbar === true)

watch(hideNavbar, (shouldHide) => {
  console.log('hideNavbar changed:', shouldHide)

  if (shouldHide) {
    closeMenu()
  } else {
    console.log('openmenud')
    openMenu()
  }
}, { immediate: true })

const containerClass = computed(() => ({
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive
}));


function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event: MouseEvent) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event: MouseEvent): boolean {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    const target = event.target as HTMLElement | null;

    if (!target || !sidebarEl || !topbarEl) {
        return true; // fallback: treat as outside click if elements are missing
    }

    return !(
        sidebarEl === target ||
        sidebarEl.contains(target) ||
        topbarEl === target ||
        topbarEl.contains(target)
    );
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar :hideNavbar="hideNavbar"></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
</template>
