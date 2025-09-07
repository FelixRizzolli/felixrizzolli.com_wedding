<template>
    <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900">{{ t('gallery.title') }}</h2>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                <div v-for="product in products" :key="product.id" class="group relative">
                    <img
                        :src="product.imageSrc"
                        :alt="product.imageAlt"
                        class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-60"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const { t } = useI18n();

    // create an array of numbers 1..20 and map to product objects
    const products = Array.from({ length: 20 }, (_, i) => i + 1).map((element) => {
        return {
            id: element,
            imageSrc: `https://wedding-cdn.felixrizzolli.com/Hochzeit-${element}.jpg`,
            imageAlt: t('gallery.imageAlt'),
        };
    });
</script>
