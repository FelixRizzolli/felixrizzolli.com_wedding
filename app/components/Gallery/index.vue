<template>
  <section class="container mx-auto px-4 py-10 space-y-8">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">
        {{ $t('gallery.title') }}
      </h2>
      <p class="text-muted-foreground text-sm">
        {{ $t('gallery.subtitle') }}
      </p>
    </div>

    <!-- Error state -->
    <div
      v-if="error"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div class="rounded-full bg-destructive/10 p-6 mb-4">
        <AlertCircleIcon class="size-8 text-destructive" />
      </div>
      <p class="font-semibold">{{ $t('gallery.error.title') }}</p>
      <p class="text-muted-foreground text-sm mt-1">{{ $t('gallery.error.description') }}</p>
      <Button variant="outline" class="mt-4" @click="refetch">
        {{ $t('gallery.error.retry') }}
      </Button>
    </div>

    <!-- Gallery view (images + lightbox) -->
    <GalleryView
      v-else
      :images="images"
      :is-loading="pending"
    />

    <!-- Pagination -->
    <CustomPagination
      v-if="!error && totalPages > 1"
      :total-pages="totalPages"
      :current-page="currentPage"
      @page-change="handlePageChange"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ClientError, GraphQLClient } from 'graphql-request'
import { AlertCircleIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import GalleryView from '@/components/Gallery/View.vue'
import CustomPagination from '@/components/Custom/Pagination.vue'
import { useAuth } from '~/composables/useAuth'
import type { WeddingImage } from '~/types/types'

const LIMIT = 24

const WEDDING_IMAGES_QUERY = `
  query WeddingImages($page: Int, $limit: Int) {
    WeddingImages(page: $page, limit: $limit) {
      docs {
        id
        ident
        cloudflareLink
        onedriveLink
      }
      totalDocs
      totalPages
      page
      hasNextPage
      hasPrevPage
    }
  }
`

interface WeddingImagesData {
  WeddingImages: {
    docs: WeddingImage[]
    totalDocs: number
    totalPages: number
    page: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

const config = useRuntimeConfig()

const { token, logout } = useAuth()

const images = ref<WeddingImage[]>([])
const totalPages = ref(1)
const currentPage = ref(1)
const pending = ref(false)
const error = ref<Error | null>(null)

async function fetchImages(page: number): Promise<void> {
  pending.value = true
  error.value = null

  try {
    const headers: Record<string, string> = token.value
      ? { Authorization: `JWT ${token.value}` }
      : {}

    const client = new GraphQLClient(`${config.public.apiUrl}/api/graphql`, { headers })

    const data = await client.request<WeddingImagesData>(WEDDING_IMAGES_QUERY, {
      page,
      limit: LIMIT,
    })

    images.value = data.WeddingImages.docs
    totalPages.value = data.WeddingImages.totalPages
  } catch (err) {
    // HTTP 401 = token expired / invalid; HTTP 403 = not authorised.
    // Both cases mean the stored session is no longer valid → log out.
    if (err instanceof ClientError && (err.response.status === 401 || err.response.status === 403)) {
      logout()
      await navigateTo('/login')
      return
    }
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    pending.value = false
  }
}

function refetch() {
  fetchImages(currentPage.value)
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchImages(page)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => fetchImages(1))
</script>

<style scoped></style>
