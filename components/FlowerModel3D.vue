<template>
  <div class="relative w-full h-full overflow-hidden bg-abyss-950">
    <!-- WebGL Canvas Container -->
    <div ref="canvasContainerRef" class="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

    <!-- Loading Indicator -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-400 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-abyss-950/80 backdrop-blur-md pointer-events-none"
      >
        <div class="relative w-16 h-16 flex items-center justify-center mb-4">
          <div class="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" />
          <div class="w-12 h-12 rounded-full border-2 border-t-white border-r-transparent border-b-white/20 border-l-transparent animate-spin" />
          <span class="text-lg">🌸</span>
        </div>
        <p class="text-xs font-mono text-neutral-300 tracking-widest uppercase animate-pulse">
          {{ loadingProgress > 0 ? `加载花卉模型中 (${loadingProgress}%)` : '加载 3D 繁花中...' }}
        </p>
      </div>
    </Transition>

    <!-- Subtle Cinematic Vignette -->
    <div class="pointer-events-none absolute inset-0 bg-radial-vignette opacity-70" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { getFlowerModelById, type FlowerModelInfo } from '~/constants/models';
import { playChime, playPopSound } from '~/utils/audioSynth';

const props = withDefaults(
  defineProps<{
    modelId?: string;
    autoRotate?: boolean;
    interactive?: boolean;
  }>(),
  {
    modelId: 'bouquet',
    autoRotate: true,
    interactive: true
  }
);

const emit = defineEmits<{
  (e: 'model-loaded', model: FlowerModelInfo): void;
}>();

const canvasContainerRef = ref<HTMLDivElement | null>(null);
const isLoading = ref(true);
const loadingProgress = ref(0);

// ── Three.js Scene References ───────────────────────────────────────
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let bloomPass: UnrealBloomPass;
let controls: OrbitControls;
let animationFrameId: number;
let clock: THREE.Clock;

// ── Model & Particle References ─────────────────────────────────────
let currentModelGroup: THREE.Group | null = null;
let animationMixer: THREE.AnimationMixer | null = null;
let sparkParticles: THREE.Points | null = null;
let gltfLoader: GLTFLoader;
let pointTexture: THREE.Texture;

// ── Animation States ────────────────────────────────────────────────
let animTime = 0;
let entranceProgress = 0;
let isEntranceComplete = false;
let currentModelInfo: FlowerModelInfo;

// ── Dynamic Spark Particle Sprite ───────────────────────────────────
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── Ambient Floating Stardust Sparks ────────────────────────────────
function createStardust(accentColorHex: string, count = 350): THREE.Points {
  const positions: number[] = [];
  const colors: number[] = [];
  const baseColor = new THREE.Color(accentColorHex);

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 5.5;
    const y = (Math.random() - 0.2) * 4.5;
    const z = (Math.random() - 0.5) * 5.5;

    positions.push(x, y, z);
    const c = baseColor.clone().offsetHSL((Math.random() - 0.5) * 0.15, 0, (Math.random() - 0.5) * 0.2);
    colors.push(c.r, c.g, c.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.032,
    map: pointTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

// ── Load and Setup GLB 3D Model ─────────────────────────────────────
function loadModel(modelInfo: FlowerModelInfo) {
  isLoading.value = true;
  loadingProgress.value = 0;
  currentModelInfo = modelInfo;
  entranceProgress = 0;
  isEntranceComplete = false;

  const url = `/models/${modelInfo.file}`;

  gltfLoader.load(
    url,
    (gltf) => {
      // Clean up previous model
      if (currentModelGroup) {
        scene.remove(currentModelGroup);
        currentModelGroup.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else {
              mesh.material?.dispose();
            }
          }
        });
      }

      if (animationMixer) {
        animationMixer.stopAllAction();
        animationMixer = null;
      }

      const model = gltf.scene;

      // Enhance materials & PBR properties
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.side = THREE.DoubleSide;
            mat.roughness = Math.min(0.9, Math.max(0.2, mat.roughness ?? 0.6));
            mat.metalness = Math.min(0.4, mat.metalness ?? 0.1);
            mat.envMapIntensity = 1.2;
          }
        }
      });

      // Calculate Bounding Box and Center Model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      const targetScale = (modelInfo.targetScale || 2.2) / maxDim;

      // Group wrapper for smooth pivot animations
      const wrapperGroup = new THREE.Group();
      model.position.set(-center.x, -center.y, -center.z);
      wrapperGroup.add(model);

      wrapperGroup.scale.setScalar(0.001); // Start from small for entrance animation
      wrapperGroup.userData = { targetScale, baseCenter: center };

      currentModelGroup = wrapperGroup;
      scene.add(currentModelGroup);

      // Setup embedded animations if present
      if (gltf.animations && gltf.animations.length > 0) {
        animationMixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          const action = animationMixer!.clipAction(clip);
          action.play();
        });
      }

      // Update stardust aura particles
      if (sparkParticles) {
        scene.remove(sparkParticles);
      }
      sparkParticles = createStardust(modelInfo.glowColor || modelInfo.accentColor, 350);
      scene.add(sparkParticles);

      // Adjust camera distance for optimal view
      const targetCamDist = modelInfo.cameraDistance || 4.2;
      camera.position.set(0, 1.2, targetCamDist);
      controls.target.set(0, 0, 0);
      controls.update();

      isLoading.value = false;
      emit('model-loaded', modelInfo);
    },
    (xhr) => {
      if (xhr.total > 0) {
        loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100);
      }
    },
    (err) => {
      console.error('Failed to load flower model:', err);
      isLoading.value = false;
    }
  );
}

// ── Render & Animation Loop ─────────────────────────────────────────
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  animTime += delta;

  // 1. Model Entrance Scale Animation (Ease Out Elastic)
  if (currentModelGroup) {
    if (!isEntranceComplete) {
      entranceProgress = Math.min(1, entranceProgress + delta * 1.6);
      // Ease Out Back
      const c = 1.4;
      const t = entranceProgress;
      const easeT = 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
      const targetScale = currentModelGroup.userData.targetScale || 2.2;
      currentModelGroup.scale.setScalar(THREE.MathUtils.lerp(0.001, targetScale, easeT));

      if (entranceProgress >= 1) {
        isEntranceComplete = true;
      }
    }

    // 2. Gentle Floating & Turntable Rotation + Gyroscope Parallax
    currentModelGroup.position.y = Math.sin(animTime * 1.4) * 0.06;
    if (props.autoRotate) {
      currentModelGroup.rotation.y = animTime * 0.35 + currentTiltX;
      currentModelGroup.rotation.x = currentTiltY;
    } else {
      currentModelGroup.rotation.y = currentTiltX;
      currentModelGroup.rotation.x = currentTiltY;
    }

    // Smooth lerp tilt
    currentTiltX = THREE.MathUtils.lerp(currentTiltX, targetTiltX, 0.05);
    currentTiltY = THREE.MathUtils.lerp(currentTiltY, targetTiltY, 0.05);
  }

  // 3. Embedded GLTF Animation Mixer
  if (animationMixer) {
    animationMixer.update(delta);
  }

  // 4. Stardust floating drift
  if (sparkParticles) {
    sparkParticles.rotation.y = animTime * 0.05;
    const posAttr = sparkParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    for (let i = 1; i < posArr.length; i += 3) {
      posArr[i] += Math.sin(animTime * 1.2 + i) * 0.001;
    }
    posAttr.needsUpdate = true;
  }

  controls.update();
  composer.render();
}

// ── Gyroscope / Device Orientation ──────────────────────────────────
let targetTiltX = 0;
let targetTiltY = 0;
let currentTiltX = 0;
let currentTiltY = 0;
let lastChimeTime = 0;

function handleOrientation(e: DeviceOrientationEvent) {
  if (e.gamma === null || e.beta === null) return;
  targetTiltX = (e.gamma / 90) * 0.35;
  targetTiltY = ((e.beta - 45) / 90) * 0.25;
}

function handlePointerDown() {
  const now = Date.now();
  if (now - lastChimeTime > 600) {
    playChime(659.25, 1.2, 0.15);
    lastChimeTime = now;
  }
}

// ── Lifecycle & Setup ───────────────────────────────────────────────
onMounted(() => {
  const container = canvasContainerRef.value;
  if (!container) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = null;

  // 2. Camera
  camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 4.5);

  // 3. Renderer with transparent background for Gu Feng bg.jpg
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Lighting Rig (Cinematic Studio Lighting)
  const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
  keyLight.position.set(4, 6, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xecfeff, 1.2);
  fillLight.position.set(-4, 3, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xdbeafe, 1.8);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.0);
  scene.add(hemiLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // 5. Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 2.0;
  controls.maxDistance = 9.0;
  controls.maxPolarAngle = Math.PI / 2 + 0.15;
  controls.enabled = props.interactive;
  controls.update();

  // 6. Postprocessing (Subtle Bloom)
  const renderPass = new RenderPass(scene, camera);
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.65, // Strength (优雅柔和，不破坏纹理)
    0.45, // Radius
    0.45  // Threshold
  );

  const outputPass = new OutputPass();

  composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  // 7. Textures & Loaders
  pointTexture = createParticleTexture();
  gltfLoader = new GLTFLoader();

  // 8. Initial Model Load
  const initialModel = getFlowerModelById(props.modelId);
  loadModel(initialModel);

  // 9. Render Loop
  clock = new THREE.Clock();
  animate();

  window.addEventListener('resize', handleResize);
  window.addEventListener('deviceorientation', handleOrientation);
  container.addEventListener('pointerdown', handlePointerDown);
});

function handleResize() {
  if (!canvasContainerRef.value || !renderer || !camera || !composer) return;
  const w = canvasContainerRef.value.clientWidth;
  const h = canvasContainerRef.value.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
}

// ── Watchers ────────────────────────────────────────────────────────
watch(
  () => props.modelId,
  (newId) => {
    if (!scene) return;
    playPopSound();
    const targetModel = getFlowerModelById(newId);
    loadModel(targetModel);
  }
);

watch(
  () => props.interactive,
  (val) => {
    if (controls) controls.enabled = val;
  }
);

function getCanvas(): HTMLCanvasElement | null {
  return renderer ? renderer.domElement : null;
}

function captureSnapshot(): string {
  if (!renderer || !composer || !scene || !camera) return '';
  try {
    composer.render();
    return renderer.domElement.toDataURL('image/png');
  } catch (err) {
    console.error('Failed to capture WebGL snapshot:', err);
    return '';
  }
}

defineExpose({
  getCanvas,
  captureSnapshot
});

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('deviceorientation', handleOrientation);
  if (canvasContainerRef.value) {
    canvasContainerRef.value.removeEventListener('pointerdown', handlePointerDown);
  }
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
.bg-radial-vignette {
  background: radial-gradient(circle at center, transparent 35%, rgba(5, 5, 8, 0.8) 95%);
}
</style>
