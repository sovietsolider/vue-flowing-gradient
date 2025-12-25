<template>
  <CodePreview :code="fileContent">
    <CodeRenderer :code="fileContent" :lang="lang" />
  </CodePreview>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CodePreview from './CodePreview.vue'
import CodeRenderer from './CodeRenderer.vue'

interface Props {
  filePath?: string
  code?: string
  lang?: string
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  lang: 'tsx',
})

const fileContent = computed(() => {
  // In Nuxt, we can't read files at runtime like in Next.js
  // So we just use the code prop directly
  return props.code
})
</script>

