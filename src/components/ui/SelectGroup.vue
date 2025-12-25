<template>
  <SelectGroup v-bind="$attrs">
    <slot />
  </SelectGroup>
</template>

<script setup lang="ts">
import { SelectGroup } from 'radix-vue'

defineOptions({
  inheritAttrs: false,
})
</script>

