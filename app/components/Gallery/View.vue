<template>
  <div class="space-y-6">

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      <Skeleton
        v-for="n in SKELETON_COUNT"
        :key="n"
        class="aspect-square rounded-xl"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!images.length"
      class="flex flex-col items-center justify-center py-32 text-center"
    >
      <div class="mb-4 rounded-full bg-muted p-6">
        <ImageIcon class="size-10 text-muted-foreground" />
      </div>
      <p class="text-lg font-semibold">{{ t('gallery.empty.title') }}</p>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('gallery.empty.description') }}</p>
    </div>

    <!-- Image grid -->
    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      <button
        v-for="(image, index) in images"
        :key="image.ident"
        class="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-muted shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        :aria-label="`${t('gallery.imageAlt')} ${index + 1}`"
        @click="lightboxIndex = index"
      >
        <img
          :src="image.cdnLink || image.onedriveLink"
          :alt="`${t('gallery.imageAlt')} – ${image.ident}`"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span
          class="pointer-events-none absolute inset-0 flex items-end bg-linear-to-t from-black/70 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span class="truncate text-xs font-medium tracking-wide text-white drop-shadow">
            {{ image.ident }}
          </span>
        </span>
      </button>
    </div>

  </div>

  <!-- Lightbox -->
  <GalleryLightbox v-model="lightboxIndex" :images="images" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ImageIcon } from '@lucide/vue'
import { Skeleton } from '~/components/ui/skeleton'
import GalleryLightbox from '~/components/Gallery/Lightbox.vue'
import type { WeddingImage } from '~/types/types'

const SKELETON_COUNT = 12

defineProps<{
  images: WeddingImage[]
  isLoading: boolean
}>()

const { t } = useI18n()

const lightboxIndex = ref<number | null>(null)
</script>
