import { useAuthStore } from '~/stores/auth'

/**
 * Route middleware: auth
 *
 * Redirects unauthenticated visitors to the login page.
 * Apply to any protected page via:
 *
 * ```ts
 * definePageMeta({ middleware: 'auth' })
 * ```
 */
export default defineNuxtRouteMiddleware((to) => {
  // Skip guard for the login page itself to avoid an infinite redirect loop
  if (to.path === '/login') return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})

