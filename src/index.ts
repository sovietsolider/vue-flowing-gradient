// Main component export
// Note: Vue components are distributed as source files and resolved by the consumer's bundler
export { default as GradFlow } from './components/GradFlow.vue'

// Types
export type {
  RGB,
  GradientType,
  GradientConfig,
  GradientConfigInput,
  GradFlowProps,
} from './types/gradient'

// Constants and presets
export { DEFAULT_CONFIG, PRESETS, GRADIENT_TYPE_NUMBER } from './constants/gradients'

// Utility functions
export { hexToRgb, rgbToHex, normalizeColor } from './lib/color-conversion'
export { randomRGB, generateRandomColors } from './lib/random-colors'
