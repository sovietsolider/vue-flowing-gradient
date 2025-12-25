<template>
  <div>
    <h3 class="font-semibold mb-3">Gradient Controls</h3>

    <Select :value="config.type" @update:value="(e) => onConfigChange({ type: e as GradientType })">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          <SelectItem value="linear">Linear</SelectItem>
          <SelectItem value="conic">Conic</SelectItem>
          <SelectItem value="animated">Animated</SelectItem>
          <SelectItem value="wave">Wave</SelectItem>
          <SelectItem value="silk">Silk</SelectItem>
          <SelectItem value="smoke">Smoke</SelectItem>
          <SelectItem value="stripe">Stripe</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <div class="space-y-2">
      <div
        v-for="colorKey in ['color1', 'color2', 'color3']"
        :key="colorKey"
        class="flex items-center space-x-3"
      >
        <input
          type="color"
          :value="rgbToHex(config[colorKey as keyof GradientConfig] as RGB)"
          @input="(e) =>
            onConfigChange({
              [colorKey]: hexToRgb((e.target as HTMLInputElement).value),
            })"
          class="w-10 h-6 rounded border cursor-pointer"
        />
        <input
          type="text"
          :value="rgbToHex(config[colorKey as keyof GradientConfig] as RGB)"
          @input="(e) =>
            onConfigChange({
              [colorKey]: hexToRgb((e.target as HTMLInputElement).value),
            })"
          class="flex-1 border rounded px-2 py-1 text-xs"
        />
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="randomize-type"
          v-model="randomizeType"
          class="w-4 h-4 cursor-pointer"
        />
        <label for="randomize-type" class="text-sm cursor-pointer">
          Randomize type
        </label>
      </div>
      <Button
        @click="handleRandomize"
        class="w-full"
        variant="outline"
      >
        Randomize
      </Button>
    </div>

    <div>
      <label class="block text-sm mb-1">Speed: {{ config.speed.toFixed(1) }}</label>
      <Slider
        :min="0"
        :max="3"
        :step="0.1"
        :value="[config.speed]"
        @update:value="(e) => onConfigChange({ speed: Number(e[0]) })"
        aria-label="speed"
      />
    </div>

    <div>
      <label class="block text-sm mb-1">Scale: {{ config.scale.toFixed(1) }}</label>
      <Slider
        :min="0.5"
        :max="3"
        :step="0.1"
        :value="[config.scale]"
        @update:value="(e) => onConfigChange({ scale: Number(e[0]) })"
        aria-label="scale"
      />
    </div>

    <div>
      <label class="block text-sm mb-1">Noise: {{ config.noise.toFixed(2) }}</label>
      <Slider
        :min="0"
        :max="0.5"
        :step="0.01"
        :value="[config.noise]"
        @update:value="(e) => onConfigChange({ noise: Number(e[0]) })"
        aria-label="noise"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GradientConfig, GradientType, RGB } from '@/types/gradient'
import { hexToRgb, rgbToHex } from '@/lib/color-utils'
import { generateRandomColors, randomGradientType } from '@/lib/random-colors'
import Select from '../ui/Select.vue'
import SelectTrigger from '../ui/SelectTrigger.vue'
import SelectValue from '../ui/SelectValue.vue'
import SelectContent from '../ui/SelectContent.vue'
import SelectGroup from '../ui/SelectGroup.vue'
import SelectLabel from '../ui/SelectLabel.vue'
import SelectItem from '../ui/SelectItem.vue'
import Slider from '../ui/Slider.vue'
import Button from '../ui/Button.vue'

interface Props {
  config: GradientConfig
  onConfigChange: (updates: Partial<GradientConfig>) => void
}

const props = defineProps<Props>()

const randomizeType = ref(true)

const handleRandomize = () => {
  const randomConfig = generateRandomColors()
  if (randomizeType.value) {
    randomConfig.type = randomGradientType()
  }
  props.onConfigChange(randomConfig)
}
</script>

