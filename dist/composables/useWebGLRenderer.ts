import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  unref,
  toRef,
  nextTick,
} from "vue";
import type { Ref, ComputedRef } from "vue";
import { Renderer, Program, Mesh, Transform, Plane } from "ogl";
import type { GradientConfig } from "@/types/gradient";
import { normalizeRgb } from "@/lib/color-utils";
import { GRADIENT_TYPE_NUMBER } from "@/constants/gradients";

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_scale;
  uniform int u_type;
  uniform float u_noise;
  uniform vec2 u_resolution;

  varying vec2 vUv;

  #define PI 3.14159265359


  // @Utility
  float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // @Gradient Types
  vec3 linearGradient(vec2 uv, float time) {
    float t = (uv.y * u_scale) + sin(uv.x * PI + time) * 0.1;
    t = clamp(t, 0.0, 1.0);

    return t < 0.5
      ? mix(u_color1, u_color2, t * 2.0)
      : mix(u_color2, u_color3, (t - 0.5) * 2.0);
  }

  vec3 conicGradient(vec2 uv, float time) {
    vec2 center = vec2(0.5);
    vec2 pos = uv - center;

    float angle = atan(pos.y, pos.x);
    float normalizedAngle = (angle + PI) / (2.0 * PI);

    float t = fract(normalizedAngle * u_scale + time * 0.3);
    float smoothT = t;

    vec3 color;
    if (smoothT < 0.33) {
      color = mix(u_color1, u_color2, smoothstep(0.0, 0.33, smoothT));
    } else if (smoothT < 0.66) {
      color = mix(u_color2, u_color3, smoothstep(0.33, 0.66, smoothT));
    } else {
      color = mix(u_color3, u_color1, smoothstep(0.66, 1.0, smoothT));
    }

    float dist = length(pos);
    color += sin(dist * 8.0 + time * 1.5) * 0.03;

    return color;
  }

  #define S(a,b,t) smoothstep(a,b,t)

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
  }

  float advancedNoise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                  mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5 * n;
  }

  vec3 animatedGradient(vec2 uv, float time) {
    float ratio = u_resolution.x / u_resolution.y;
    vec2 tuv = uv;
    tuv -= 0.5;

    float degree = advancedNoise(vec2(time * 0.1 * u_speed, tuv.x * tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 * u_scale + 180.0));
    tuv.y *= ratio;

    float frequency = 5.0 * u_scale;
    float amplitude = 30.0;
    float speed = time * 2.0 * u_speed;
    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

    vec3 layer1 = mix(u_color1, u_color2, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
    vec3 layer2 = mix(u_color2, u_color3, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));

    vec3 finalComp = mix(layer1, layer2, S(0.05, -0.2, tuv.y));

    return finalComp;
  }

  vec3 waveGradient(vec2 uv, float time) {
    float y = uv.y;

    float wave1 = sin(uv.x * PI * u_scale * 0.8 + time * u_speed * 0.5) * 0.1;
    float wave2 = sin(uv.x * PI * u_scale * 0.5 + time * u_speed * 0.3) * 0.15;
    float wave3 = sin(uv.x * PI * u_scale * 1.2 + time * u_speed * 0.8) * 0.2;

    float flowingY = y + wave1 + wave2 + wave3;
    float pattern = smoothstep(0.0, 1.0, clamp(flowingY, 0.0, 1.0));

    vec3 color;
    if (pattern < 0.33) {
      float t = smoothstep(0.0, 0.33, pattern);
      color = mix(u_color1, u_color2, t);
    } else if (pattern < 0.66) {
      float t = smoothstep(0.33, 0.66, pattern);
      color = mix(u_color2, u_color3, t);
    } else {
      float t = smoothstep(0.66, 1.0, pattern);
      color = mix(u_color3, u_color1, t);
    }

    float variation = sin(uv.x * PI * 2.0 + time * u_speed) *
                      cos(uv.y * PI * 1.5 + time * u_speed * 0.7) * 0.02;
    color += variation;

    return clamp(color, 0.0, 1.0);
  }

  vec3 silkGradient(vec2 uv, float time) {
    vec2 fragCoord = uv * u_resolution;
    vec2 invResolution = 1.0 / u_resolution.xy;
    vec2 centeredUv = (fragCoord * 2.0 - u_resolution.xy) * invResolution;

    centeredUv *= u_scale;

    float dampening = 1.0 / (1.0 + u_scale * 0.1);

    float d = -time * u_speed * 0.5;
    float a = 0.0;

    for (float i = 0.0; i < 8.0; ++i) {
        a += cos(i - d - a * centeredUv.x) * dampening;
        d += sin(centeredUv.y * i + a) * dampening;
    }

    d += time * u_speed * 0.5;

    vec3 patterns = vec3(
      cos(centeredUv.x * d + a) * 0.5 + 0.5,
      cos(centeredUv.y * a + d) * 0.5 + 0.5,
      cos((centeredUv.x + centeredUv.y) * (d + a) * 0.5) * 0.5 + 0.5
    );

    vec3 color1Mix = mix(u_color1, u_color2, patterns.x);
    vec3 color2Mix = mix(u_color2, u_color3, patterns.y);
    vec3 color3Mix = mix(u_color3, u_color1, patterns.z);

    vec3 finalColor = mix(color1Mix, color2Mix, patterns.z);
    finalColor = mix(finalColor, color3Mix, patterns.x * 0.5);

    vec3 originalPattern = vec3(cos(centeredUv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
    originalPattern = cos(originalPattern * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);

    return mix(finalColor, originalPattern * finalColor, 0.3);
  }

  vec3 smokeGradient(vec2 uv, float time) {
    float mr = min(u_resolution.x, u_resolution.y);
    vec2 fragCoord = uv * u_resolution;
    vec2 p = (2.0 * fragCoord.xy - u_resolution.xy) / mr;

    p *= u_scale;

    float iTime = time * u_speed;

    for(int i = 1; i < 10; i++) {
      vec2 newp = p;
      float fi = float(i);
      newp.x += 0.6 / fi * sin(fi * p.y + iTime + 0.3 * fi) + 1.0;
      newp.y += 0.6 / fi * sin(fi * p.x + iTime + 0.3 * (fi + 10.0)) - 1.4;
      p = newp;
    }

    float redPattern = 1.0;
    float greenPattern = 1.0 - sin(p.y);
    float bluePattern = sin(p.x + p.y);

    greenPattern = clamp(greenPattern, 0.0, 1.0);
    bluePattern = bluePattern * 0.5 + 0.5;

    vec3 color;

    vec3 color12 = mix(u_color1, u_color2, greenPattern);

    color = mix(color12, u_color3, bluePattern);

    return clamp(color, 0.0, 1.0);
  }

  vec3 stripeGradient(vec2 uv, float time) {
    vec2 p = ((uv * u_resolution * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0) * u_scale;
    float t = time * 0.7, a = 4.0 * p.y - sin(-p.x * 3.0 + p.y - t);
    a = smoothstep(cos(a) * 0.7, sin(a) * 0.7 + 1.0, cos(a - 4.0 * p.y) - sin(a + 3.0 * p.x));

    vec2 warped = (cos(a) * p + sin(a) * vec2(-p.y, p.x)) * 0.5 + 0.5;
    vec3 color = mix(u_color1, u_color2, warped.x);

    color = mix(color, u_color3, warped.y);
    color *= color + 0.6 * sqrt(color);

    return clamp(color, 0.0, 1.0);
  }

  // @Main
  void main() {
    vec2 uv = vUv;
    float time = u_time * u_speed;

    vec3 color;

    if (u_type == 0) {
      color = linearGradient(uv, time);
    } else if (u_type == 1) {
      color = conicGradient(uv, time);
    } else if (u_type == 2) {
      color = animatedGradient(uv, time);
    } else if (u_type == 3) {
      color = waveGradient(uv, time);
    } else if (u_type == 4) {
      color = silkGradient(uv, time);
    } else if (u_type == 5) {
      color = smokeGradient(uv, time);
    } else if (u_type == 6) {
      color = stripeGradient(uv, time);
    } else {
      color = animatedGradient(uv, time);
    }

    if (u_noise > 0.001) {
      float grain = noise(uv * 200.0 + time * 0.1);
      color *= (1.0 - u_noise * 0.4 + u_noise * grain * 0.4);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface UseWebGLRendererReturn {
  canvasRef: Ref<HTMLCanvasElement | null>;
  rendererRef: Ref<Renderer | null>;
  programRef: Ref<Program | null>;
  meshRef: Ref<Mesh | null>;
}

export function useWebGLRenderer(
  config: GradientConfig | Ref<GradientConfig> | ComputedRef<GradientConfig>
) {
  const configValue = computed(() => {
    if (config && typeof config === "object" && "value" in config) {
      return config.value;
    }
    return config as GradientConfig;
  });
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const rendererRef = ref<Renderer | null>(null);
  const programRef = ref<Program | null>(null);
  const meshRef = ref<Mesh | null>(null);
  const rafRef = ref<number>(0);

  const normalizedColors = computed(() => {
    const config = configValue.value;
    if (!config || !config.color1 || !config.color2 || !config.color3) {
      // Fallback to default colors if config is not ready
      const defaultColors = { r: 226, g: 98, b: 75 };
      return {
        color1: normalizeRgb(defaultColors),
        color2: normalizeRgb({ r: 255, g: 255, b: 255 }),
        color3: normalizeRgb({ r: 30, g: 34, b: 159 }),
      };
    }
    return {
      color1: normalizeRgb(config.color1),
      color2: normalizeRgb(config.color2),
      color3: normalizeRgb(config.color3),
    };
  });

  const handleResize = () => {
    const canvas = canvasRef.value;
    const renderer = rendererRef.value;
    const program = programRef.value;

    if (!canvas || !renderer) return;

    // For fullscreen, always use window dimensions
    // This ensures canvas takes full viewport
    // const w = window.innerWidth;
    // const h = window.innerHeight;

    const h = canvas.parentElement?.clientHeight || 0;
    const w = canvas.parentElement?.clientWidth || 0;

    const dpr = Math.min(window.devicePixelRatio, 2);

    // Set canvas internal size (for rendering) - must be set before setSize
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    // Set canvas display size (CSS) - this controls visual size
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";

    // Set renderer size
    renderer.setSize(w, h);

    if (program) {
      program.uniforms.u_resolution.value = [w, h];
    }
  };

  onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    rendererRef.value = renderer;

    const gl = renderer.gl;
    const plane = new Plane(gl, { width: 2, height: 2 });

    window.addEventListener("resize", handleResize, { passive: true });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_color1: { value: normalizedColors.value.color1 },
        u_color2: { value: normalizedColors.value.color2 },
        u_color3: { value: normalizedColors.value.color3 },
        u_speed: { value: configValue.value.speed },
        u_scale: { value: configValue.value.scale },
        u_type: {
          value: GRADIENT_TYPE_NUMBER[configValue.value.type ?? "animated"],
        },
        u_noise: { value: configValue.value.noise },
        u_resolution: { value: [canvas.clientWidth, canvas.clientHeight] },
      },
    });
    programRef.value = program;

    const mesh = new Mesh(gl, { geometry: plane, program });
    meshRef.value = mesh;
    const scene = new Transform();
    mesh.setParent(scene);

    // Wait for DOM to be fully rendered before setting size
    nextTick(() => {
      handleResize();
      // Call multiple times to ensure layout is complete
      setTimeout(handleResize, 10);
      setTimeout(handleResize, 50);
      setTimeout(handleResize, 100);
    });

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      program.uniforms.u_time.value = elapsed;

      renderer.render({ scene: mesh });
      rafRef.value = requestAnimationFrame(animate);
    };

    rafRef.value = requestAnimationFrame(animate);
  });

  onUnmounted(() => {
    cancelAnimationFrame(rafRef.value);
    window.removeEventListener("resize", handleResize);

    const gl = rendererRef.value?.gl;

    if (programRef.value?.program && gl) {
      gl.deleteProgram(programRef.value.program);
    }

    rendererRef.value = null;
    programRef.value = null;
    meshRef.value = null;
  });

  watch(
    () => [configValue.value, normalizedColors.value],
    () => {
      const program = programRef.value;
      if (!program) return;

      program.uniforms.u_color1.value = normalizedColors.value.color1;
      program.uniforms.u_color2.value = normalizedColors.value.color2;
      program.uniforms.u_color3.value = normalizedColors.value.color3;
      program.uniforms.u_speed.value = configValue.value.speed;
      program.uniforms.u_scale.value = configValue.value.scale;
      program.uniforms.u_type.value =
        GRADIENT_TYPE_NUMBER[configValue.value.type ?? "animated"];
      program.uniforms.u_noise.value = configValue.value.noise;
    },
    { deep: true }
  );

  return { canvasRef, rendererRef, programRef, meshRef };
}
