import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * Composable for managing the app color theme.
 *
 * Uses @vueuse/core's `useColorMode` which:
 * - Persists the user's preference to localStorage under the key 'theme'
 * - Applies the resolved mode as a CSS class on <html>  (class="dark" or class="light")
 * - 'auto' mode follows the operating-system preference via `prefers-color-scheme`
 */
export function useTheme() {
  const colorMode = useColorMode<ThemeMode>({
    attribute: 'class',
    selector: 'html',
    storageKey: 'theme',
    initialValue: 'auto',

    // Map modes to the CSS class names. 'auto' resolves automatically via
    // system preference – no dedicated class is needed for it.
    modes: {
      auto: '',
      light: 'light',
      dark: 'dark',
    },
  })

  /** The stored preference: 'auto', 'light', or 'dark'. */
  const preference = computed<ThemeMode>({
    get: () => colorMode.store.value as ThemeMode,
    set: (val) => { colorMode.store.value = val },
  })

  function setTheme(val: ThemeMode) {
    colorMode.store.value = val
  }

  return { preference, setTheme }
}

