<template>
  <div class="space-y-8">

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      <div
        v-for="n in SKELETON_COUNT"
        :key="n"
        class="aspect-square rounded-xl bg-muted animate-pulse"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!images.length"
      class="flex flex-col items-center justify-center py-32 text-center"
    >
      <div class="rounded-full bg-muted p-6 mb-4">
        <ImageIcon class="size-10 text-muted-foreground" />
      </div>
      <p class="text-lg font-semibold">No images yet</p>
      <p class="text-muted-foreground text-sm mt-1">
        Check back later for photos from the wedding.
      </p>
    </div>

    <!-- Image grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      <button
        v-for="(image, index) in images"
        :key="image.ident"
        class="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-zoom-in"
        @click="openLightbox(index)"
      >
        <img
          :src="image.cloudflareLink || image.onedriveLink"
          :alt="image.ident"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <!-- Hover overlay -->
        <div
          class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none"
        >
          <span class="text-white text-xs font-medium tracking-wide truncate drop-shadow">
            {{ image.ident }}
          </span>
        </div>
      </button>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-1.5 pt-2"
    >
      <Button
        variant="outline"
        size="icon"
        :disabled="currentPage <= 1"
        aria-label="Previous page"
        @click="$emit('page-change', currentPage - 1)"
      >
        <ChevronLeftIcon class="size-4" />
      </Button>

      <template v-for="item in paginationItems" :key="item">
        <span
          v-if="item === ELLIPSIS"
          class="px-2 text-muted-foreground select-none"
        >
          …
        </span>
        <Button
          v-else
          :variant="item === currentPage ? 'default' : 'outline'"
          size="icon"
          :aria-label="`Go to page ${item}`"
          :aria-current="item === currentPage ? 'page' : undefined"
          @click="$emit('page-change', item)"
        >
          {{ item }}
        </Button>
      </template>

      <Button
        variant="outline"
        size="icon"
        :disabled="currentPage >= totalPages"
        aria-label="Next page"
        @click="$emit('page-change', currentPage + 1)"
      >
        <ChevronRightIcon class="size-4" />
      </Button>
    </div>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="lightboxIndex !== null && currentImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        @click.self="closeLightbox"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 text-white p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close lightbox"
          @click="closeLightbox"
        >
          <XIcon class="size-5" />
        </button>

        <!-- Counter -->
        <span class="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm select-none">
          {{ lightboxIndex + 1 }} / {{ images.length }}
        </span>

        <!-- Prev arrow -->
        <button
          v-if="lightboxIndex > 0"
          class="absolute left-4 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Previous image"
          @click="lightboxIndex--"
        >
          <ChevronLeftIcon class="size-6" />
        </button>

        <!-- Image -->
        <Transition name="lightbox-img" mode="out-in">
          <img
            :key="lightboxIndex"
            :src="currentImage.cloudflareLink || currentImage.onedriveLink"
            :alt="currentImage.ident"
            class="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain select-none"
          />
        </Transition>

        <!-- Next arrow -->
        <button
          v-if="lightboxIndex < images.length - 1"
          class="absolute right-4 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Next image"
          @click="lightboxIndex++"
        >
          <ChevronRightIcon class="size-6" />
        </button>

        <!-- Image title -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm tracking-wide bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
          {{ currentImage.ident }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ImageIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { WeddingImage } from '~/types/types'

const SKELETON_COUNT = 12
const ELLIPSIS = '...' as const

const props = withDefaults(defineProps<{
  images: WeddingImage[]
  totalPages: number
  currentPage: number
  isLoading: boolean
}>(), {
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
})

defineEmits<{
  'page-change': [page: number]
}>()

/**
 * Builds a compact list of page number items with ellipsis markers.
 * E.g. [1, '...', 4, 5, 6, '...', 10]
 */
const paginationItems = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const delta = 2 // pages around current

  const range: Array<number | typeof ELLIPSIS> = []
  const pages = new Set<number>()

  pages.add(1)
  pages.add(total)
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    pages.add(i)
  }

  let prev: number | null = null
  for (const page of Array.from(pages).sort((a, b) => a - b)) {
    if (prev !== null && page - prev > 1) range.push(ELLIPSIS)
    range.push(page)
    prev = page
  }

  return range
})

const lightboxIndex = ref<number | null>(null)

/** Safely typed reference to the image currently open in the lightbox. */
const currentImage = computed<WeddingImage | null>(() =>
  lightboxIndex.value !== null ? (props.images[lightboxIndex.value] ?? null) : null,
)

function openLightbox(index: number) {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft' && lightboxIndex.value > 0) lightboxIndex.value--
  if (e.key === 'ArrowRight' && lightboxIndex.value < props.images.length - 1) lightboxIndex.value++
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-img-enter-active,
.lightbox-img-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lightbox-img-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.lightbox-img-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>