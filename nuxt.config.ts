// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['./app/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss()
        ]
    },

    modules: ['@nuxt/image', 'nuxt-svgo', '@nuxtjs/i18n', 'shadcn-nuxt', '@pinia/nuxt'],

    runtimeConfig: {
        public: {
            /** Base URL of the PayloadCMS API (e.g. https://api.example.com) */
            apiUrl: process.env.API_URL ?? 'http://localhost:3000',
        },
    },

    i18n: {
        defaultLocale: 'de',
        locales: [
            { code: 'de', name: 'Deutsch', file: 'de.json' },
            { code: 'it', name: 'Italiano', file: 'de.json' },
            { code: 'en', name: 'English', file: 'de.json' },
        ],
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
            // multipass: true, // optimization will be applied until the result differs from the one obtained in the previous step
            plugins: [
                {
                    name: 'preset-default', //  default set of plugins, https://svgo.dev/docs/preset-default/#plugins-list
                    params: {
                        overrides: {
                            removeViewBox: false, // viewbox is required for svg to scale properly
                            mergePaths: false, // disable mergePaths to preserve all paths
                            collapseGroups: false, // disable collapseGroups to preserve groups
                        },
                    },
                },
                // additional plugins, https://svgo.dev/docs/plugins/
                'removeDimensions', // remove width and height attributes,
                'removeXMLNS', // remove xmlns attribute
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
        componentDir: './components/ui'
    }
});
