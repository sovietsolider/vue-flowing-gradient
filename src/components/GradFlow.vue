<template>
  <canvas
    ref="canvasRef"
    :class="cn('w-full h-full block select-none touch-none', className)"
    :style="{ width: '100%', height: '100%', display: 'block' }"
    aria-label="gradflow animated gradient background"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GradFlowProps, GradientConfig } from '@/types/gradient'
import { DEFAULT_CONFIG } from '@/constants/gradients'
import { useWebGLRenderer } from '@/composables/useWebGLRenderer'
import { normalizeColor } from '@/lib/color-conversion'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<GradFlowProps>(), {
  className: '',
})

const config = computed<GradientConfig>(() => {
  const normalized: GradientConfig = { ...DEFAULT_CONFIG }

  if (props.config) {
    if (props.config.color1) normalized.color1 = normalizeColor(props.config.color1)
    if (props.config.color2) normalized.color2 = normalizeColor(props.config.color2)
    if (props.config.color3) normalized.color3 = normalizeColor(props.config.color3)
    if (props.config.speed !== undefined) normalized.speed = props.config.speed
    if (props.config.scale !== undefined) normalized.scale = props.config.scale
    if (props.config.type) normalized.type = props.config.type
    if (props.config.noise !== undefined) normalized.noise = props.config.noise
  }

  return normalized
})

const { canvasRef } = useWebGLRenderer(config)
</script>

