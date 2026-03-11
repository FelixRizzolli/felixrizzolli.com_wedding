import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { GraphQLClient, gql } from 'graphql-request'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  /** Unique username of the authenticated guest */
  username: string
}

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

const LOGIN_WITH_INVITATION_TOKEN_MUTATION = gql`
  mutation LoginWithInvitationToken($username: String!, $invitationToken: String!) {
    loginWithInvitationToken(username: $username, invitationToken: $invitationToken) {
      token
      exp
      username
    }
  }
`

interface LoginWithInvitationTokenResponse {
  loginWithInvitationToken: {
    token: string
    exp: string
    username: string
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

/**
 * Auth store for wedding guest authentication.
 *
 * Written in the **setup-store** form so that Nuxt composables (`useCookie`,
 * `useRuntimeConfig`) can be called directly inside the store setup function.
 * They are guaranteed to run within an active Nuxt + Pinia context, which
 * avoids the "no active Pinia" error that occurs when stores are instantiated
 * outside the component/plugin lifecycle (e.g. in a plain plugin file).
 *
 * Tokens are persisted in client-readable cookies so they survive page
 * reloads and are available during SSR hydration on the next visit.
 */
export const useAuthStore = defineStore('auth', () => {
  // ── Persisted state via SSR-safe cookies ──────────────────────────────────
  //
  // `useCookie` is reactive: writing to `.value` automatically updates the
  // browser cookie and (on the server) the Set-Cookie response header.

  const tokenCookie = useCookie<string | null>('auth_token', {
    default: () => null,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  })

  const usernameCookie = useCookie<string | null>('auth_username', {
    default: () => null,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  })

  // ── In-memory state (hydrated from cookies on first store access) ─────────

  const token = ref<string | null>(tokenCookie.value)
  const exp = ref<string | null>(null)
  const user = ref<AuthUser | null>(
    usernameCookie.value ? { username: usernameCookie.value } : null,
  )

  // ── Getters ───────────────────────────────────────────────────────────────

  /** `true` when a token is present (the guest has logged in). */
  const isAuthenticated = computed(() => !!token.value)

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Authenticate a guest by username + invitation token.
   *
   * Calls the custom `loginWithToken` GraphQL mutation on the PayloadCMS API.
   * On success the JWT is stored in state and persisted to cookies. On
   * failure the original error is re-thrown so the calling component can
   * surface a user-friendly message.
   *
   * @param username        - The guest's unique username
   * @param invitationToken - The token printed on their invitation card
   */
  async function login(username: string, invitationToken: string): Promise<void> {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl as string

    const client = new GraphQLClient(`${apiUrl}/api/graphql`, {
      mode: 'cors',
    })

    const data = await client.request<LoginWithInvitationTokenResponse>(LOGIN_WITH_INVITATION_TOKEN_MUTATION, {
      username,
      invitationToken,
    })

    const result = data.loginWithInvitationToken

    // Update in-memory state
    token.value = result.token
    exp.value = result.exp
    user.value = { username: result.username }

    // Persist to cookies — reactive refs keep cookie & state in sync
    tokenCookie.value = result.token
    usernameCookie.value = result.username
  }

  /**
   * Clear all authentication state and remove the persisted cookies.
   */
  function logout(): void {
    token.value = null
    exp.value = null
    user.value = null
    tokenCookie.value = null
    usernameCookie.value = null
  }

  return {
    // State
    token,
    exp,
    user,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
  }
})
