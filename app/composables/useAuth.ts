import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

/**
 * Composable that exposes authentication state and actions to components.
 *
 * Wraps the Pinia auth store with `storeToRefs` so that reactive properties
 * can be destructured without losing reactivity. Components should use this
 * composable instead of accessing the store directly.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { isAuthenticated, user, login, logout } = useAuth()
 * </script>
 * ```
 */
export function useAuth() {
  const store = useAuthStore()
  const { token, exp, user, isAuthenticated } = storeToRefs(store)

  return {
    // ── State (reactive refs) ────────────────────────────────────────────────
    token,
    exp,
    user,
    isAuthenticated,

    // ── Actions ──────────────────────────────────────────────────────────────
    /**
     * Authenticate the guest. Throws on invalid credentials so the caller
     * can display an appropriate error message.
     */
    login: store.login.bind(store),

    /** Remove authentication state and cookies. */
    logout: store.logout.bind(store),
  }
}

