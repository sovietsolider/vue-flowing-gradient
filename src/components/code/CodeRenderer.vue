<template>
  <div class="font-mono">
    <div v-html="html" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { codeToHtml } from '@/lib/shiki'

interface Props {
  code: string
  lang: string
}

const props = defineProps<Props>()

const html = ref('')

onMounted(async () => {
  html.value = await codeToHtml({
    code: props.code,
    lang: props.lang,
  })
})
</script>

