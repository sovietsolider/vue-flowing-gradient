import { defineConfig } from "tsup";
import path from "path";
import { copyFileSync, mkdirSync, existsSync, writeFileSync } from "fs";
import vue from "unplugin-vue/esbuild";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false, // Disable automatic DTS generation, we'll create it manually
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ["vue", "vue/server-renderer"],
  treeshake: true,
  minify: false,
  esbuildPlugins: [vue()],
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "./src"),
    };
  },
  onSuccess: async () => {
    // Copy Vue component files to dist (as source for consumers)
    const vueFiles = ["src/components/GradFlow.vue"];

    vueFiles.forEach((file) => {
      const dest = file.replace("src/", "dist/");
      const destDir = path.dirname(dest);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(file, dest);
    });

    // Copy composables directory
    const composableFiles = ["src/composables/useWebGLRenderer.ts"];

    composableFiles.forEach((file) => {
      const dest = file.replace("src/", "dist/");
      const destDir = path.dirname(dest);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(file, dest);
    });

    // Copy lib directory
    const libFiles = [
      "src/lib/color-conversion.ts",
      "src/lib/color-utils.ts",
      "src/lib/random-colors.ts",
      "src/lib/utils.ts",
    ];

    libFiles.forEach((file) => {
      const dest = file.replace("src/", "dist/");
      const destDir = path.dirname(dest);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(file, dest);
    });

    // Copy types directory
    const typeFiles = ["src/types/gradient.ts"];

    typeFiles.forEach((file) => {
      const dest = file.replace("src/", "dist/");
      const destDir = path.dirname(dest);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(file, dest);
    });

    // Copy constants directory
    const constantFiles = ["src/constants/gradients.ts"];

    constantFiles.forEach((file) => {
      const dest = file.replace("src/", "dist/");
      const destDir = path.dirname(dest);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(file, dest);
    });

    // Create manual type declarations
    const indexDts = `// Main component export
import type { DefineComponent } from 'vue'
import type { GradFlowProps } from './types/gradient'

export declare const GradFlow: DefineComponent<GradFlowProps>

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
`;

    writeFileSync("dist/index.d.ts", indexDts);
    writeFileSync("dist/index.d.mts", indexDts);
  },
});
