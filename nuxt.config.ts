// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['./app/assets/css/main.css'],

    vite: {
        plugins: [
            tailwindcss(),
        ],

        // Pre-bundle runtime-discovered dependencies to avoid page reloads in dev
        optimizeDeps: {
            include: [
                'graphql-request',
                '@lucide/vue',
                'class-variance-authority',
                'reka-ui',
                'clsx',
                'tailwind-merge',
                '@vueuse/core',
            ],
        },
    },

    components: [
        {
            path: '~/components',
            extensions: ['vue'],
        },
    ],

    modules: ['@nuxt/image', 'nuxt-svgo', '@nuxtjs/i18n', 'shadcn-nuxt', '@pinia/nuxt'],

    runtimeConfig: {
        public: {
            /** Base URL of the PayloadCMS API (e.g. https://api.example.com) */
            apiUrl: process.env.API_URL ?? 'http://localhost:3000',
        },
    },

    i18n: {
        strategy: 'no_prefix',
        defaultLocale: 'de',
        locales: [
            { code: 'de', name: 'Deutsch', file: 'de.json' },
            { code: 'it', name: 'Italiano', file: 'it.json' },
            { code: 'en', name: 'English', file: 'en.json' },
        ],
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_locale',
            cookieSecure: false,
            alwaysRedirect: false,
            fallbackLocale: 'de',
            redirectOn: 'root',
        },
    },

    app: {
        head: {
            titleTemplate: '%s | Elisabeth & Felix',
            htmlAttrs: {
                lang: 'de',
            },
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' },
                { rel: 'apple-touch-icon', sizes: '167x167', href: '/apple-touch-icon-167x167.png' },
                { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#000000' },
                { rel: 'manifest', href: '/site.webmanifest' },
            ],
            meta: [
                { name: 'theme-color', content: '#efb100' },
                { name: 'msapplication-TileColor', content: '#efb100' },
            ],
        },
    },

    svgo: {
        componentPrefix: 'i',
        autoImportPath: '~/assets/images/',
        customComponent: 'MyIcon',
        svgoConfig: {
            plugins: [
                {
                    // Default set of plugins: https://svgo.dev/docs/preset-default/#plugins-list
                    // NOTE: removeViewBox is NOT part of preset-default — omitting it here
                    // keeps viewBox intact (SVGO's default behaviour when it's not listed).
                    name: 'preset-default',
                    params: {
                        overrides: {
                            mergePaths: false,     // preserve all paths
                            collapseGroups: false, // preserve groups
                        },
                    },
                },
                // Additional plugins: https://svgo.dev/docs/plugins/
                'removeDimensions', // remove width and height attributes
                'removeXMLNS',      // remove xmlns attribute
            ],
        },
    },

    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './components/ui',
    },
});
