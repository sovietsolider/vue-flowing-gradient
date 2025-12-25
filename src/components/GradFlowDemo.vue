<template>
  <div class="h-screen w-full flex flex-col items-center justify-between relative py-2 rounded-3xl">
    <div class="flex w-full max-w-md z-50 container">
      <div class="dark flex justify-between items-center w-full p-3 bg-white/20 outline-1 outline-offset-2 outline-white/25 rounded-lg backdrop-blur-lg">
        <img width="30" height="30" src="/logo.svg" alt="logo" />
        <div class="relative">
          <Popover>
            <PopoverTrigger>
              <Button class="capitalize cursor-pointer">
                <Settings />
                playground
              </Button>
            </PopoverTrigger>
            <PopoverContent class="space-y-4">
              <GradientControls :config="config" @config-change="updateConfig" />
              <PresetButtons @apply-preset="applyPreset" />

              <div class="flex gap-2">
                <Button
                  class="flex-1 capitalize cursor-pointer"
                  @click="handleCopyCode"
                  size="icon"
                >
                  <Code />
                  copy
                </Button>
                <Button
                  variant="outline"
                  class="cursor-pointer"
                  @click="handleCaptureImage"
                  title="Capture Image"
                >
                  <ImageDown />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>

    <ContentDemo />

    <canvas
      ref="canvasRef"
      :class="cn('w-full h-full block absolute -z-10 top-0 touch-none select-none', className)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GradFlowProps, GradientConfig } from '@/types/gradient'
import { DEFAULT_CONFIG, PRESETS } from '@/constants/gradients'
import { useWebGLRenderer } from '@/composables/useWebGLRenderer'
import { captureImage } from '@/lib/image-capture'
import { copyCodeToClipboard } from '@/lib/clipboard'
import { normalizeColor } from '@/lib/color-conversion'
import { cn } from '@/lib/utils'
import ContentDemo from './ContentDemo.vue'
import { Code, ImageDown, Settings } from 'lucide-vue-next'
import Popover from './ui/Popover.vue'
import PopoverContent from './ui/PopoverContent.vue'
import PopoverTrigger from './ui/PopoverTrigger.vue'
import Button from './ui/Button.vue'
import GradientControls from './demo/GradientControls.vue'
import PresetButtons from './demo/PresetButtons.vue'

const props = withDefaults(defineProps<GradFlowProps>(), {
  className: '',
})

const config = ref<GradientConfig>(() => {
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

const { canvasRef, rendererRef, meshRef } = useWebGLRenderer(config)

const updateConfig = (updates: Partial<GradientConfig>) => {
  config.value = { ...config.value, ...updates }
}

const applyPreset = (presetName: keyof typeof PRESETS) => {
  config.value = { ...config.value, ...PRESETS[presetName] }
}

const handleCaptureImage = () => {
  const canvas = canvasRef.value
  const renderer = rendererRef.value
  const mesh = meshRef.value

  if (!canvas || !renderer) {
    console.log('Canvas or renderer not ready. Please try again.')
    return
  }

  captureImage(canvas, renderer, mesh)
}

const handleCopyCode = () => {
  copyCodeToClipboard(config.value)
}
</script>

