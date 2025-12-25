<template>
  <SliderRoot
    :class="cn(
      'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
      className
    )"
    :default-value="defaultValue"
    :value="value"
    :min="min"
    :max="max"
    v-bind="$attrs"
  >
    <SliderTrack
      class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
    >
      <SliderRange class="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, index) in _values"
      :key="index"
      class="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  SliderRoot,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  defaultValue?: number[]
  value?: number[]
  min?: number
  max?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  className: '',
})

const _values = computed(() =>
  Array.isArray(props.value)
    ? props.value
    : Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.min, props.max]
)

defineOptions({
  inheritAttrs: false,
})
</script>

