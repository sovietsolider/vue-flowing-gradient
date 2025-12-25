# GradFlow

Beautiful animated WebGL gradients for Vue and Nuxt. Create stunning, performant gradient backgrounds with multiple animation styles.

## Features

- 🎨 **7 Gradient Types**: Linear, Conic, Animated, Wave, Silk, Smoke, and Stripe
- 🚀 **High Performance**: WebGL-powered rendering with optimized shaders for smooth 60fps animations
- 🎛️ **Fully Customizable**: Control colors, animation speed, scale, and noise
- 📱 **Responsive**: Automatically adapts to container size
- 🔧 **TypeScript Support**: Fully typed API
- 🎭 **Easy Integration**: Simple npm install and import
- ⚡ **Vue 3 & Nuxt 3**: Built with Composition API and fully compatible with Nuxt

## Installation

```bash
npm install gradflow
```

## Quick Start

### Vue 3

```vue
<template>
  <div class="relative h-screen">
    <GradFlow />
    <!-- Your content here -->
  </div>
</template>

<script setup lang="ts">
import { GradFlow } from "gradflow";
</script>
```

### Nuxt 3

```vue
<template>
  <div class="relative h-screen">
    <GradFlow />
    <!-- Your content here -->
  </div>
</template>

<script setup lang="ts">
import { GradFlow } from "gradflow";
</script>
```

## Usage Examples

### With Custom Configuration

```vue
<template>
  <GradFlow
    :config="{
      color1: { r: 226, g: 98, b: 75 },
      color2: { r: 255, g: 255, b: 255 },
      color3: { r: 30, g: 34, b: 159 },
      speed: 0.4,
      scale: 1,
      type: 'stripe',
      noise: 0.08,
    }"
  />
</template>

<script setup lang="ts">
import { GradFlow } from "gradflow";
</script>
```

### Using Hex Colors

```vue
<template>
  <GradFlow
    :config="{
      color1: '#e2624b',
      color2: '#ffffff',
      color3: '#1e229f',
    }"
  />
</template>

<script setup lang="ts">
import { GradFlow } from "gradflow";
</script>
```

### Using Presets

```vue
<template>
  <GradFlow :config="PRESETS.cosmic" />
</template>

<script setup lang="ts">
import { GradFlow, PRESETS } from "gradflow";
</script>
```

Available presets: `cosmic`, `matrix`, `electric`, `inferno`, `mystic`, `cyber`, `neon`, `plasma`

### Reactive Configuration

```vue
<template>
  <GradFlow :config="gradientConfig" />
  <button @click="randomizeColors">Randomize</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GradFlow, generateRandomColors, PRESETS } from "gradflow";

const gradientConfig = ref(PRESETS.cosmic);

const randomizeColors = () => {
  gradientConfig.value = generateRandomColors();
};
</script>
```

### Full Screen Background

```vue
<template>
  <div class="relative h-screen w-full">
    <GradFlow :config="PRESETS.cosmic" class="absolute inset-0" />
    <div class="relative z-10">
      <!-- Your content here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { GradFlow, PRESETS } from "gradflow";
</script>
```

## API Reference

### GradFlow Component

| Prop        | Type                  | Default          | Description                   |
| ----------- | --------------------- | ---------------- | ----------------------------- |
| `config`    | `GradientConfigInput` | `DEFAULT_CONFIG` | Gradient configuration object |
| `className` | `string`              | `''`             | Additional CSS classes        |

### GradientConfigInput

All properties are optional. You can use either hex strings or RGB objects for colors.

```typescript
type GradientConfigInput = {
  color1?: string | RGB; // First gradient color
  color2?: string | RGB; // Second gradient color
  color3?: string | RGB; // Third gradient color
  speed?: number; // Animation speed (0.1-3.0)
  scale?: number; // Pattern scale (0.5-3.0)
  type?: GradientType; // Gradient pattern type
  noise?: number; // Noise intensity (0-0.5)
};

type RGB = {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
};
```

### Gradient Types

- `linear` - Classic linear gradient with wave distortion
- `animated` - Dynamic flowing patterns with rotation
- `conic` - Circular/radial gradient patterns
- `wave` - Wave-based undulating patterns
- `silk` - Smooth silk-like flowing textures
- `smoke` - Organic smoke-like patterns
- `stripe` - Warped stripe patterns (default)

## Utility Functions

### Color Conversion

```typescript
import { hexToRgb, rgbToHex, normalizeColor } from "gradflow";

// Convert hex to RGB
const rgb = hexToRgb("#ff0000"); // { r: 255, g: 0, b: 0 }

// Convert RGB to hex
const hex = rgbToHex({ r: 255, g: 0, b: 0 }); // '#ff0000'

// Normalize color (accepts both string and RGB)
const normalized = normalizeColor("#ff0000"); // { r: 255, g: 0, b: 0 }
```

### Random Colors

```typescript
import { randomRGB, generateRandomColors } from "gradflow";

// Generate single random RGB color
const color = randomRGB();

// Generate random gradient colors
const colors = generateRandomColors();
// Returns: { color1: RGB, color2: RGB, color3: RGB }
```

## Nuxt 3 Integration

### Auto-import (Recommended)

Nuxt 3 will automatically import components. Just use `GradFlow` in your templates:

```vue
<template>
  <GradFlow :config="PRESETS.cosmic" />
</template>
```

### Manual Import

If auto-import is disabled, import explicitly:

```vue
<template>
  <GradFlow :config="gradientConfig" />
</template>

<script setup lang="ts">
import { GradFlow, PRESETS } from "gradflow";

const gradientConfig = PRESETS.cosmic;
</script>
```

### Nuxt Plugin (Optional)

Create a plugin to make GradFlow available globally:

```typescript
// plugins/gradflow.client.ts
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  // GradFlow is available globally via auto-import
});
```

## Performance Tips

- Use `scale` values between 0.5-2.0 for optimal performance
- Lower `noise` values (< 0.2) perform better
- The component automatically limits device pixel ratio to 2 for performance
- Canvas automatically resizes on window resize events

## Requirements

- Vue >= 3.5.0
- Nuxt >= 3.13.0 (if using Nuxt)
- Modern browser with WebGL support

## Browser Support

GradFlow works in all modern browsers that support WebGL:

- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

## TypeScript

GradFlow is written in TypeScript and provides full type definitions:

```typescript
import type {
  GradFlowProps,
  GradientConfig,
  GradientConfigInput,
  RGB,
  GradientType,
} from "gradflow";
```

## License

MIT License - feel free to use in your projects!

## Credits

Created by [Meer](https://www.meera.dev/)

---

**Note**: This component requires WebGL support. It gracefully handles unsupported environments but won't render gradients in very old browsers.
