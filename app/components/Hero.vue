<template>
    <div class="hero-component relative isolate h-screen" :style="{ backgroundImage: `url('${previewImages[0]}')` }">
        <div
            class="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
        >
            <div
                class="aspect-801/1036 w-200.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                style="
                    clip-path: polygon(
                        63.1% 29.5%,
                        100% 17.1%,
                        76.6% 3%,
                        48.4% 0%,
                        44.6% 4.7%,
                        54.5% 25.3%,
                        59.8% 49%,
                        55.2% 57.8%,
                        44.4% 57.2%,
                        27.8% 47.9%,
                        35.1% 81.5%,
                        0% 97.7%,
                        39.2% 100%,
                        35.2% 81.4%,
                        97.2% 52.8%,
                        63.1% 29.5%
                    );
                "
            />
        </div>
        <div class="overflow-hidden">
            <div class="mx-auto max-w-7xl px-6 pt-36 pb-32 sm:pt-60 lg:px-8 lg:pt-32">
                <div class="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                    <div class="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                        <h1 class="text-5xl font-semibold tracking-tight text-pretty text-white sm:text-7xl">
                            {{ t('title') }}
                        </h1>
                        <p
                            class="mt-8 text-lg font-medium text-pretty text-white sm:max-w-md sm:text-xl/8 lg:max-w-none"
                        >
                            {{ t('text') }}
                        </p>
                        <div class="mt-10 flex items-center gap-x-6">
                            <a
                                href="#"
                                class="rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {{ t('button.gallery') }}
                            </a>
                            <a href="#" class="text-sm/6 font-semibold text-white hover:text-yellow-500">
                                {{ t('button.images') }} <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                    <div
                        class="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0 hidden lg:flex"
                    >
                        <div
                            class="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80"
                        >
                            <div class="relative">
                                <img
                                    :src="previewImages[1]"
                                    alt=""
                                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                />
                                <div
                                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"
                                />
                            </div>
                        </div>
                        <div class="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                            <div class="relative">
                                <img
                                    :src="previewImages[2]"
                                    alt=""
                                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                />
                                <div
                                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"
                                />
                            </div>
                            <div class="relative">
                                <img
                                    :src="previewImages[3]"
                                    alt=""
                                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                />
                                <div
                                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"
                                />
                            </div>
                        </div>
                        <div class="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                            <div class="relative">
                                <img
                                    :src="previewImages[4]"
                                    alt=""
                                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                />
                                <div
                                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"
                                />
                            </div>
                            <div class="relative">
                                <img
                                    :src="previewImages[5]"
                                    alt=""
                                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                />
                                <div
                                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { Dialog, DialogPanel } from '@headlessui/vue';
    import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

    const { t } = useI18n();

    const previewImages = ref([
        'https://wedding-cdn.felixrizzolli.com/Hochzeit-293.jpg',
        'https://wedding-cdn.felixrizzolli.com/Hochzeit-196.jpg',
        'https://wedding-cdn.felixrizzolli.com/Hochzeit-939.jpg',
        'https://wedding-cdn.felixrizzolli.com/Hochzeit-646.jpg',
        'https://wedding-cdn.felixrizzolli.com/Hochzeit-770.jpg',
        'https://wedding-cdn.felixrizzolli.com/Hochzeit-783.jpg',
    ]);

    const mobileMenuOpen = ref(false);
</script>

<style lang="css" scoped>
    .hero-component {
        background-image: url('https://www.patscheider-hof.com/wp-content/uploads/2014/05/slide21.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
</style>
