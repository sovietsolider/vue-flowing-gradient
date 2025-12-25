<template>
  <div class="gap-4 flex flex-col items-center max-w-4xl">
    <div class="space-y-2 text-white text-center">
      <h1 class="bg-gradient-to-tr from-white via-white to-transparent bg-clip-text text-transparent text-4xl md:text-7xl font-bold leading-tight text-balance">
        Create Amazing Gradients Using WebGL
      </h1>
      <p class="md:text-xl leading-relaxed text-balance">
        High-performance Vue component for animated WebGL gradient backgrounds with real-time customization.
      </p>
    </div>

    <NuxtLink to="#installation">
      <Button class="capitalize cursor-pointer">
        <Download />
        installation
      </Button>
    </NuxtLink>
  </div>
  <div class="flex w-full items-center justify-between gap-2 container">
    <a href="https://www.meera.dev/" target="_blank">
      <img
        src="https://www.meera.dev/logo.svg"
        width="28"
        height="28"
        alt="Meera Dev Logo"
        class="w-8 h-8 mask-t-from-40%"
      />
    </a>

    <div class="flex gap-2">
      <a target="_blank" href="https://github.com/meerbahadin/gradflow">
        <Button
          size="icon"
          class="cursor-pointer dark text-foreground bg-background/30 hover:bg-background/50"
        >
          <Github />
        </Button>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download, Github } from 'lucide-vue-next'
import Button from './ui/Button.vue'
</script>

