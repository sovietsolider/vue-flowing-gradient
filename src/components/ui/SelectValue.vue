<template>
  <SelectValue v-bind="$attrs">
    <slot />
  </SelectValue>
</template>

<script setup lang="ts">
import { SelectValue } from 'radix-vue'

defineOptions({
  inheritAttrs: false,
})
</script>

