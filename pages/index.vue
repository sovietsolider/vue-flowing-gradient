<template>
  <main class="relative h-screen w-full overflow-hidden">
    <GradFlow :config="gradientConfig" class="absolute inset-0 w-full h-full" />
  </main>
</template>

<script setup lang="ts">
import { Download, Github } from "lucide-vue-next";
import GradFlow from "@/components/GradFlow.vue";
import FeatureCards from "@/components/FeatureCards.vue";
import CodeBlock from "@/components/code/CodeBlock.vue";
import Button from "@/components/ui/Button.vue";
import { PRESETS } from "@/constants/gradients";

const importExampleCode = `import { GradFlow } from 'gradflow'

<template>
  <div class="relative h-screen">
    <GradFlow />
    <!-- Your content here -->
  </div>
</template>`;

const customColorsExampleCode = `<GradFlow
  :config="{
    color1: '#e2624b',
    color2: '#ffffff',
    color3: '#1e229f',
    speed: 0.4,
    scale: 1,
    type: 'stripe',
  }
"/>`;

const presetsExampleCode = `import { PRESETS } from 'gradflow'

<GradFlow :config="PRESETS.cosmic" />

// Available presets:
// cosmic, matrix, electric, inferno, mystic, cyber, neon, plasma`;

const randomGradientsExampleCode = `import { generateRandomColors } from 'gradflow'

const colors = ref(generateRandomColors())

<GradFlow :config="colors" />
<button @click="colors = generateRandomColors()">
  Randomize
</button>`;

// Example gradient configuration
const gradientConfig = PRESETS.cosmic;

const configTableRows = [
  {
    property: "color1",
    type: "string | RGB",
    default: "{r:226,g:98,b:75}",
    description: "First gradient color (hex or RGB)",
  },
  {
    property: "color2",
    type: "string | RGB",
    default: "{r:255,g:255,b:255}",
    description: "Second gradient color (hex or RGB)",
  },
  {
    property: "color3",
    type: "string | RGB",
    default: "{r:30,g:34,b:159}",
    description: "Third gradient color (hex or RGB)",
  },
  {
    property: "speed",
    type: "number",
    default: "0.4",
    description: "Animation speed (0.1 - 3.0)",
  },
  {
    property: "scale",
    type: "number",
    default: "1",
    description: "Pattern scale (0.5 - 3.0)",
  },
  {
    property: "type",
    type: "string",
    default: "'stripe'",
    description: "Gradient pattern type",
    types: ["linear", "animated", "conic", "wave", "silk", "smoke", "stripe"],
  },
  {
    property: "noise",
    type: "number",
    default: "0.08",
    description: "Noise intensity (0 - 0.5)",
  },
];
</script>
