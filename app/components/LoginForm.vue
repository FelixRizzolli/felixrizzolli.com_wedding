<template>
    <div :class="[isModal ? 'p-0' : 'flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8']">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <i-logo class="h-12 w-12 mx-auto" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                {{ t('form.login.title') }}
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="submitLogin">
                <div>
                    <label for="username" class="block text-sm/6 font-medium text-gray-900">{{
                        t('form.username')
                    }}</label>
                    <div class="mt-2">
                        <input
                            type="text"
                            name="username"
                            id="username"
                            v-model="username"
                            autocomplete="username"
                            required=""
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium text-gray-900">{{
                            t('form.password')
                        }}</label>
                    </div>
                    <div class="mt-2">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            v-model="password"
                            autocomplete="current-password"
                            required=""
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {{ t('button.login') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({ isModal: { type: Boolean, default: false } });
    const emit = defineEmits(['success']);
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');
    const { fetch, loggedIn } = useUserSession();

    const { t } = useI18n();

    async function submitLogin() {
        loading.value = true;
        error.value = '';
        try {
            await $fetch('/api/auth/login', {
                method: 'POST',
                body: { username: username.value, password: password.value },
            });
            await fetch();
            emit('success');
        } catch (e: any) {
            error.value = e?.data?.statusMessage || 'Login failed';
        } finally {
            loading.value = false;
        }
    }

    async function submitRegister() {
        loading.value = true;
        error.value = '';
        try {
            await $fetch('/api/auth/register', {
                method: 'POST',
                body: { username: username.value, password: password.value },
            });
            await submitLogin();
        } catch (e: any) {
            error.value = e?.data?.statusMessage || 'Registration failed';
        } finally {
            loading.value = false;
        }
    }
</script>
