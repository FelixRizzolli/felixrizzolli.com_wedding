<template>
  <form :class="cn('flex flex-col gap-6', props.class)" @submit.prevent="handleSubmit">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">
          {{ t('form.login.title') }}
        </h1>
        <p class="text-muted-foreground text-sm text-balance">
          {{ t('form.login.description') }}
        </p>
      </div>

      <Field>
        <FieldLabel for="username">
          {{ t('form.username') }}
        </FieldLabel>
        <Input
            id="username"
            v-model="username"
            type="text"
            placeholder="felix.rizzolli"
            required
        />
      </Field>

      <Field>
        <FieldLabel for="otp">
          {{ t('form.login.invitationToken') }}
        </FieldLabel>
        <InputOTP
            id="otp"
            v-model="invitationToken"
            :maxlength="6"
            :pattern="REGEXP_ONLY_DIGITS_AND_CHARS"
            inputmode="text"
            required
        >
          <InputOTPGroup class="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup class="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
            <InputOTPSlot :index="3" />
            <InputOTPSlot :index="4" />
            <InputOTPSlot :index="5" />
          </InputOTPGroup>
        </InputOTP>
      </Field>

      <p v-if="errorMessage" role="alert" class="text-destructive text-sm text-center">
        {{ errorMessage }}
      </p>

      <Field>
        <Button type="submit" :disabled="!isFormValid || isPending" class="w-full">
          <span v-if="isPending">{{ t('form.login.pending') }}</span>
          <span v-else>{{ t('form.login.submit') }}</span>
        </Button>
      </Field>
    </FieldGroup>
  </form>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '~/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'vue-input-otp'
import { useAuth } from '~/composables/useAuth'
import { InvalidCredentialsError } from '~/stores/auth'

const props = defineProps<{
  class?: HTMLAttributes['class']
  /** Pre-fill the username field from a URL query parameter */
  initialUsername?: string
  /** Pre-fill the invitation token field from a URL query parameter */
  initialToken?: string
}>()

const { login } = useAuth()
const { t } = useI18n()

const username = ref(props.initialUsername ?? '')
const invitationToken = ref(props.initialToken ?? '')
const errorMessage = ref<string | null>(null)
const isPending = ref(false)

const isFormValid = computed(
    () => username.value.trim().length > 0 && invitationToken.value.length === 6,
)

async function handleSubmit() {
  if (!isFormValid.value || isPending.value) return

  errorMessage.value = null
  isPending.value = true

  try {
    await login(username.value.trim(), invitationToken.value)
    await navigateTo('/')
  } catch (err) {
    errorMessage.value = err instanceof InvalidCredentialsError
      ? t('form.login.error')
      : t('form.login.errorServer')
  } finally {
    isPending.value = false
  }
}
</script>
