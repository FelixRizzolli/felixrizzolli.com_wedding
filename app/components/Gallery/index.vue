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

        <!-- Sort + Filter panel: always visible on lg+, toggled on mobile -->
        <div
          :class="[
            'mt-3 lg:mt-0 lg:sticky lg:top-8 space-y-4',
            filterOpen ? 'block' : 'hidden lg:block',
          ]"
        >
          <GallerySort v-model:sort="sort" />
          <GalleryFilter
            v-model:selected-categories="selectedCategories"
            v-model:selected-users="selectedUsers"
          />
        </div>
      </aside>

      <!-- Vertical divider (desktop only) -->
      <Separator orientation="vertical" class="hidden lg:block self-stretch" />

      <!-- Gallery content -->
      <div class="flex-1 min-w-0 space-y-6">
        <GalleryView :images="images" :is-loading="pending" :sort="sort" />

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
import GallerySort from '@/components/Gallery/Sort.vue'
import CustomPagination from '@/components/Custom/Pagination.vue'
import { useAuth } from '~/composables/useAuth'
import type { WeddingImage, GallerySort as GallerySortType } from '~/types/types'

const LIMIT = 24

const WEDDING_IMAGES_QUERY = `
  query WeddingImages($page: Int, $limit: Int, $where: WeddingImage_where, $sort: String) {
    WeddingImages(page: $page, limit: $limit, where: $where, sort: $sort) {
      docs {
        id
        ident
        cdnLink
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
const selectedUsers = ref<string[]>([])
const sort = ref<GallerySortType>({ field: 'createdAt', direction: 'desc' })
const filterOpen = ref(false)

function buildSortString(): string {
  const prefix = sort.value.direction === 'desc' ? '-' : ''
  return `${prefix}${sort.value.field}`
}

function buildWhere(): Record<string, unknown> | undefined {
  const conditions: Record<string, unknown>[] = []

  if (selectedCategories.value.length > 0) {
    conditions.push({ categories: { in: selectedCategories.value } })
  }

  if (selectedUsers.value.length > 0) {
    conditions.push({
      OR: [
        { guestsInFocus: { in: selectedUsers.value } },
        { guestsWithAppereance: { in: selectedUsers.value } },
      ],
    })
  }

  if (conditions.length === 0) return undefined
  if (conditions.length === 1) return conditions[0]
  return { AND: conditions }
}

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
      where: buildWhere(),
      sort: buildSortString(),
    })

    images.value = data.WeddingImages.docs
    totalPages.value = data.WeddingImages.totalPages
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
  fetchImages(currentPage.value)
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchImages(page)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Reset to page 1 and refetch whenever the category selection changes
watch(selectedCategories, () => {
  currentPage.value = 1
  fetchImages(1)
}, { deep: true })

// Reset to page 1 and refetch whenever the user selection changes
watch(selectedUsers, () => {
  currentPage.value = 1
  fetchImages(1)
}, { deep: true })

// Reset to page 1 and refetch whenever sort changes
watch(sort, () => {
  currentPage.value = 1
  fetchImages(1)
}, { deep: true })

onMounted(() => {
  fetchImages(1)
})
</script>

<style scoped></style>
