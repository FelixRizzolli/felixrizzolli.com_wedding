<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "~/components/ui/input-otp";

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <form :class="cn('flex flex-col gap-6', props.class)">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">
          Login to your account
        </h1>
        <p class="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <Field>
        <FieldLabel for="email">
          Email
        </FieldLabel>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </Field>
      <Field>
        <FieldLabel for="token">
          Token
        </FieldLabel>
        <InputOTP id="otp" :maxlength="12" required>
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
      <Field>
        <Button type="submit">
          Login
        </Button>
      </Field>
    </FieldGroup>
  </form>
</template>
