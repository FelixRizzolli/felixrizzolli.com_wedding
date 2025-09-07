<template>
    <div class="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
        <Header />
        <main class="flex-1">
            <Hero />
            <div v-if="loggedIn">
                <Gallery />
            </div>
        </main>
        <Modal :show="showLogin" @update:show="(v) => (showLogin = v)">
            <LoginForm isModal @success="showLogin = false" />
        </Modal>
        <Footer />
    </div>
</template>

<script setup lang="ts">
    const { loggedIn } = useUserSession();
    const { showLogin } = useLoginModal();
</script>
