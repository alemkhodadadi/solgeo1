import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const BrandTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdecea',
      100: '#f9d2d6',
      200: '#f4a6ad',
      300: '#ef7a84',
      400: '#ea4e5b',
      500: '#ae1e3b',
      600: '#9b1a36',
      700: '#84172f',
      800: '#6d1328',
      900: '#561021',
      950: '#3f0d1a'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f7f6f6',
          100: '#dfe0e0',
          200: '#c0c0c0',
          300: '#a0a0a0',
          400: '#808080',
          500: '#606060',
          600: '#404040',
          700: '#303030',
          800: '#202020',
          900: '#1f2823',
          950: '#191f1c'
        }
      },
      dark: {
        surface: {
          0: '#1f2823',
          50: '#2f3733',
          100: '#3f4f45',
          200: '#4f6761',
          300: '#5f7f7d',
          400: '#6f9799',
          500: '#7fafb5',
          600: '#8fc7d1',
          700: '#9fefff',
          800: '#aff7ff',
          900: '#bfffff',
          950: '#cfffff'
        }
      }
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.500}',
      offset: '1px'
    }
  },
  components: {
    card: {
      colorScheme: {
        light: {
          root: { background: '{surface.0}', color: '{surface.900}' },
          subtitle: { color: '{surface.600}' }
        },
        dark: {
          root: { background: '{surface.900}', color: '{surface.0}' },
          subtitle: { color: '{surface.300}' }
        }
      }
    }
  },
  extend: {
    my: {
      transition: { fast: '0.25s' }
    }
  },
  css: ({ dt }) => `
    .p-button-accent {
      background: ${dt('primary.500')};
      color: ${dt('surface.0')};
      transition-duration: ${dt('my.transition.fast')};
    }
  `
});

export default BrandTheme;
