import { computed, reactive } from 'vue';

type MenuMode = 'static' | 'overlay';

interface LayoutConfig {
    preset: string;
    primary: string;
    surface: string | null;
    darkTheme: boolean;
    menuMode: MenuMode;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
    activeMenuItem: any;
}

const layoutConfig = reactive<LayoutConfig>({
    preset: 'Aura',
    primary: 'brand',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
});

const layoutState = reactive<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

export function useLayout() {
    const setActiveMenuItem = (item: any) => {
        layoutState.activeMenuItem = item?.value ?? item;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();
            return;
        }

        document.startViewTransition(() => executeDarkModeToggle());
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
    };

    const toggleMenu = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const closeMenu = () => {
        layoutState.overlayMenuActive = false;
        layoutState.staticMenuMobileActive = false;

        if (window.innerWidth > 991 && layoutConfig.menuMode === 'static') {
            layoutState.staticMenuDesktopInactive = true;
        }

        layoutState.menuHoverActive = false;
    }

    const openMenu = () => {
        layoutState.overlayMenuActive = true;
        layoutState.staticMenuMobileActive = true;

        if (window.innerWidth > 991 && layoutConfig.menuMode === 'static') {
            layoutState.staticMenuDesktopInactive = true;
        }

        layoutState.menuHoverActive = true;
    }

    const isSidebarActive = computed<boolean>(
        () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
    );

    const isDarkTheme = computed<boolean>(() => layoutConfig.darkTheme);

    const getPrimary = computed<string>(() => layoutConfig.primary);

    const getSurface = computed<string | null>(() => layoutConfig.surface);

    return {
        layoutConfig,
        layoutState,
        toggleMenu,
        closeMenu,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode
    };
}
