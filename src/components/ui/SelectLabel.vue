<template>
  <SelectLabel
    :class="cn('text-muted-foreground px-2 py-1.5 text-xs', className)"
    v-bind="$attrs"
  >
    <slot />
  </SelectLabel>
</template>

<script setup lang="ts">
import { SelectLabel } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: '',
})

defineOptions({
  inheritAttrs: false,
})
</script>

