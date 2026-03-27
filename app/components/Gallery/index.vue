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

    <!-- Main layout: sidebar + gallery -->
    <div v-else class="flex flex-col lg:flex-row lg:items-start gap-8">
      <!-- Filter sidebar -->
      <aside class="lg:w-52 shrink-0">
        <!-- Mobile toggle -->
        <button
          class="lg:hidden flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          @click="filterOpen = !filterOpen"
        >
          <SlidersHorizontalIcon class="size-4" />
          {{ $t('gallery.filter.toggle') }}
          <ChevronDownIcon
            class="size-4 transition-transform duration-200"
            :class="{ 'rotate-180': filterOpen }"
          />
        </button>

        <!-- Filter panel: always visible on lg+, toggled on mobile -->
        <div
          :class="[
            'mt-3 lg:mt-0 lg:sticky lg:top-8',
            filterOpen ? 'block' : 'hidden lg:block',
          ]"
        >
          <GalleryFilter v-model:selected-categories="selectedCategories" />
        </div>
      </aside>

      <!-- Vertical divider (desktop only) -->
      <Separator orientation="vertical" class="hidden lg:block self-stretch" />

      <!-- Gallery content -->
      <div class="flex-1 min-w-0 space-y-6">
        <GalleryView :images="images" :is-loading="pending" />

        <CustomPagination
          v-if="totalPages > 1"
          :total-pages="totalPages"
          :current-page="currentPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ClientError, GraphQLClient } from 'graphql-request'
import { AlertCircleIcon, SlidersHorizontalIcon, ChevronDownIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import GalleryView from '@/components/Gallery/View.vue'
import GalleryFilter from '@/components/Gallery/Filter.vue'
import CustomPagination from '@/components/Custom/Pagination.vue'
import { useAuth } from '~/composables/useAuth'
import type { WeddingImage } from '~/types/types'

const LIMIT = 24

const WEDDING_IMAGES_QUERY = `
  query WeddingImages($page: Int, $limit: Int, $where: WeddingImage_where) {
    WeddingImages(page: $page, limit: $limit, where: $where) {
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

const selectedCategories = ref<string[]>([])
const filterOpen = ref(false)

async function fetchImages(page: number): Promise<void> {
  pending.value = true
  error.value = null

  try {
    console.debug('[Gallery] fetchImages:', { page, limit: LIMIT, selectedCategories: selectedCategories.value })
    const headers: Record<string, string> = token.value
      ? { Authorization: `JWT ${token.value}` }
      : {}

    const client = new GraphQLClient(`${config.public.apiUrl}/api/graphql`, { headers })

    const where =
      selectedCategories.value.length > 0
        ? { categories: { in: selectedCategories.value } }
        : undefined

    const data = await client.request<WeddingImagesData>(WEDDING_IMAGES_QUERY, {
      page,
      limit: LIMIT,
      where,
    })

    images.value = data.WeddingImages.docs
    totalPages.value = data.WeddingImages.totalPages
    console.debug('[Gallery] fetchImages: received', images.value.length, 'images, totalPages=', totalPages.value)
  } catch (err) {
    if (
      err instanceof ClientError &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
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
  console.debug('[Gallery] refetch requested, currentPage=', currentPage.value)
  fetchImages(currentPage.value)
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchImages(page)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Reset to page 1 and refetch whenever the category selection changes
watch(selectedCategories, (newVal, oldVal) => {
  console.debug('[Gallery] selectedCategories changed', { oldVal, newVal })
  currentPage.value = 1
  fetchImages(1)
}, { deep: true })

onMounted(() => {
  console.debug('[Gallery] mounted: initial fetchImages(1)')
  fetchImages(1)
})
</script>

<style scoped></style>
