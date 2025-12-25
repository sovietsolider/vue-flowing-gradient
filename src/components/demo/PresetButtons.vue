<template>
  <div>
    <p class="text-sm mb-2">Presets:</p>
    <div class="grid grid-cols-2 gap-1">
      <Button
        v-for="preset in Object.keys(PRESETS)"
        :key="preset"
        @click="() => onApplyPreset(preset as keyof typeof PRESETS)"
        variant="outline"
        size="sm"
        class="text-xs capitalize"
      >
        {{ preset }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRESETS } from '@/constants/gradients'
import Button from '../ui/Button.vue'

interface Props {
  onApplyPreset: (presetName: keyof typeof PRESETS) => void
}

defineProps<Props>()
</script>

