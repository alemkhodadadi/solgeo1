// src/store/app.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ILanguage, IToast, ILayoutConfig, ILayoutState, IMainRoute } from '@/interfaces'
import { useAuthStore } from './auth'
import { useProjectStore } from './project'



export const useAppStore = defineStore('app', () => {
	const authStore = useAuthStore()
	const projectStore = useProjectStore()
	
	const appGeneralSettingDrawerVisible = ref(false)

	const appLogoId = ref('')

	const layoutConfig = ref<ILayoutConfig>({
		preset: 'Aura',
		primary: 'brand',
		surface: null,
		darkTheme: false,
		menuMode: 'static'
	});

	const layoutState = ref<ILayoutState>({
		staticMenuDesktopInactive: false,
		overlayMenuActive: false,
		profileSidebarVisible: false,
		configSidebarVisible: false,
		staticMenuMobileActive: false,
		menuHoverActive: false,
		activeMenuItem: null
	});

	const toast = ref<IToast | null>(null)

	const splashScreenStatus = ref<boolean>(false)
	
	const languages: ILanguage[] = [
		{
			code: 'GB',
			label: 'English',
			locale: 'en-US',
		},
		{
			code: 'IT',
			label: 'Italiano',
			locale: 'it-IT',
		}
	]

	const applang = ref<ILanguage>(
		{
			code: 'GB',
			label: 'English',
			locale: 'en-US',
		}
	)

	function setLanguage(lang: ILanguage) {
		applang.value = languages.find((l) => l.code === lang.code) || applang.value
	}

	function notify(toastdata: IToast) {
		toast.value = toastdata
	}

	function setActiveMenuItem(item: any): void {
		layoutState.value.activeMenuItem = item?.value ?? item;
	}

	function setSplashScreen(status: boolean) {
		splashScreenStatus.value = status
	}

	const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();
            return;
        }

        document.startViewTransition(() => executeDarkModeToggle());
    };

	const executeDarkModeToggle = () => {
        layoutConfig.value.darkTheme = !layoutConfig.value.darkTheme;
        document.documentElement.classList.toggle('app-dark');
    };

	const toggleMenu = () => {
        if (layoutConfig.value.menuMode === 'overlay') {
            layoutState.value.overlayMenuActive = !layoutState.value.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.value.staticMenuDesktopInactive = !layoutState.value.staticMenuDesktopInactive;
        } else {
            layoutState.value.staticMenuMobileActive = !layoutState.value.staticMenuMobileActive;
        }
    };

	const closeMenu = () => {
        layoutState.value.overlayMenuActive = false;
        layoutState.value.staticMenuMobileActive = false;

        if (window.innerWidth > 991 && layoutConfig.value.menuMode === 'static') {
            layoutState.value.staticMenuDesktopInactive = true;
        }

        layoutState.value.menuHoverActive = false;
    }

    const openMenu = () => {

        if (window.innerWidth > 991 && layoutConfig.value.menuMode === 'static') {
            layoutState.value.staticMenuDesktopInactive = false;
        }

        layoutState.value.menuHoverActive = true;
    }

	const isDarkTheme = computed<boolean>(() => layoutConfig.value.darkTheme);

	const getPrimary = computed<string>(() => layoutConfig.value.primary);

	const getSurface = computed<string | null>(() => layoutConfig.value.surface);

	function setAppGeneralSettingDrawerVisible(status: boolean){
		console.log(status)
		appGeneralSettingDrawerVisible.value = status
	}

	function setAppLogoId(id: string) {
		appLogoId.value = id
	}

	const getAppLogoId = computed(() => appLogoId.value)

	const getCurrentMainRoute = computed<IMainRoute>(() => {
		if (authStore.isAuthenticated && !projectStore.currentProject) {
			return {
			name: 'Projects',
			route: '/projects',
			}
		} else if (authStore.isAuthenticated && projectStore.currentProject) {
			return {
			name: 'Dashboard',
			route: `/projects/${projectStore.currentProject._id}/dashboard`,
			}
		}

		return {
			name: 'Login',
			route: '/login',
		}
	})



	return {
		layoutConfig,
		layoutState,
		applang,
		splashScreenStatus,
		languages,
		setLanguage,
		notify,
		toast,
		toggleDarkMode,
		setActiveMenuItem,
		toggleMenu,
		closeMenu, 
		openMenu,
		appGeneralSettingDrawerVisible,
		setAppGeneralSettingDrawerVisible,
		setSplashScreen,
		getAppLogoId, 
		setAppLogoId,
		getCurrentMainRoute
	}
}, {
  persist: true 
})

