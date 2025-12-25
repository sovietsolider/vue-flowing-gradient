<template>
  <div class="relative group rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
    <button
      class="absolute top-3 right-3 z-10 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
      @click="onCopy"
      aria-label="Copy code"
    >
      <div
        :class="`transform transition-all duration-200 ${
          hasCheckIcon ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`"
      >
        <Copy class="h-4 w-4 text-zinc-300" />
      </div>
      <div
        :class="`absolute inset-0 flex items-center justify-center transform transition-all duration-200 ${
          hasCheckIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`"
      >
        <Check class="h-4 w-4 text-emerald-400" />
      </div>
    </button>
    <div class="max-h-[650px] overflow-auto">
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'

interface Props {
  code: string
}

const props = defineProps<Props>()

const hasCheckIcon = ref(false)

const onCopy = () => {
  navigator.clipboard.writeText(props.code)
  hasCheckIcon.value = true

  setTimeout(() => {
    hasCheckIcon.value = false
  }, 1000)
}
</script>

