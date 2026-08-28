<template>
  <div class="relative w-full h-full overflow-hidden bg-abyss-950">
    <!-- WebGL Canvas Container -->
    <div ref="canvasContainerRef" class="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

    <!-- Subtle Ambient Vignette & Gradient Overlay -->
    <div class="pointer-events-none absolute inset-0 bg-radial-vignette opacity-80" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FLOWER_THEMES, DEFAULT_THEME_ID, type FlowerTheme } from '~/constants/themes';

const props = withDefaults(
  defineProps<{
    themeId?: string;
    autoRotate?: boolean;
    bloomDuration?: number;
    initialDelay?: number;
    interactive?: boolean;
  }>(),
  {
    themeId: DEFAULT_THEME_ID,
    autoRotate: true,
    bloomDuration: 4.5,
    initialDelay: 0.3,
    interactive: true
  }
);

const emit = defineEmits<{
  (e: 'bloom-complete'): void;
}>();

const canvasContainerRef = ref<HTMLDivElement | null>(null);

// ── Three.js Global References ──────────────────────────────────────
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let bloomPass: UnrealBloomPass;
let controls: OrbitControls;
let animationFrameId: number;
let clock: THREE.Clock;
let pointTexture: THREE.Texture;

// ── Flower Structure References ─────────────────────────────────────
let flowerGroup: THREE.Group;
let stemMesh: THREE.Points;
let headGroup: THREE.Group;
let centerMesh: THREE.Points;
let leavesList: Array<{ group: THREE.Group; heightFraction: number; targetScale: number; mesh: THREE.Points }>;
let innerPetals: Array<{ spacer: THREE.Group; opener: THREE.Group; mesh: THREE.Points }>;
let outerPetals: Array<{ spacer: THREE.Group; opener: THREE.Group; mesh: THREE.Points }>;
let sparkPoints: THREE.Points;

// ── Animation State ─────────────────────────────────────────────────
let animTime = 0;
let bloomProgress = 0;
let isBloomed = false;
let currentTheme: FlowerTheme;

// ── Easing & Phase Math Functions (Extracted from reference) ─────────
function easeOutQuad(t: number): number {
  return t * (2 - t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t: number): number {
  const c = 1.6;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function remap(v: number, lo: number, hi: number): number {
  return Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
}

// 绽放各结构分段生命周期映射
const PHASE = {
  stem: [0.00, 0.32],
  leaf: [0.10, 0.42],
  center: [0.22, 0.65],
  inner: [0.28, 0.75],
  outer: [0.42, 0.95],
  color: [0.15, 0.85]
};

// ── Create Circular Glow Particle Texture ───────────────────────────
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.25)');
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── Procedural Geometry Generators (Math / Polar / Curves) ──────────

/**
 * 生成花瓣点云（基于参数化贝塞尔包络 + 双曲凹陷度）
 */
function createPetalPoints(
  width: number,
  length: number,
  budColorHex: string,
  bloomColorHex: string
): THREE.Points {
  const uSteps = 28;
  const vSteps = 16;
  const positions: number[] = [];
  const colors: number[] = [];
  const originalColors: { bud: THREE.Color; bloom: THREE.Color }[] = [];

  const budColor = new THREE.Color(budColorHex);
  const bloomColor = new THREE.Color(bloomColorHex);

  for (let i = 0; i <= uSteps; i++) {
    const u = i / uSteps; // 0 to 1 along length
    // 贝塞尔宽度轮廓：两端收敛，中下部饱满
    const currentWidth = width * 4.0 * Math.pow(u, 0.75) * Math.pow(Math.max(0, 1 - u), 0.85);

    for (let j = 0; j <= vSteps; j++) {
      const v = (j / vSteps) * 2 - 1; // -1 to 1 across width
      const x = v * (currentWidth * 0.5);
      const y = u * length;

      // 凹陷度计算：纵向卷曲 + 横向杯状凹陷
      const sagZ = -0.16 * (u * u * length) - 0.12 * (1 - v * v) * u * length;
      // 微小扰动增强自然质感
      const noise = (Math.random() - 0.5) * 0.008;

      positions.push(x, y, sagZ + noise);

      // 渐变色：基底为花苞暗色，边缘和尖端为鲜亮盛开色
      const tipFactor = Math.pow(u, 1.2) * (0.7 + 0.3 * Math.abs(v));
      const vertBud = budColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.05);
      const vertBloom = bloomColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.08);

      // 混合初态
      const initColor = vertBud.clone().lerp(vertBloom, tipFactor * 0.3);
      colors.push(initColor.r, initColor.g, initColor.b);

      originalColors.push({
        bud: vertBud,
        bloom: vertBloom
      });
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.userData = { originalColors, length, width };

  const material = new THREE.PointsMaterial({
    size: 0.024,
    map: pointTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

/**
 * 环形层叠花瓣阵列构建
 */
function buildPetalRing(
  count: number,
  width: number,
  length: number,
  budColorHex: string,
  bloomColorHex: string,
  yAngleOffset: number
) {
  const petals: Array<{ spacer: THREE.Group; opener: THREE.Group; mesh: THREE.Points }> = [];

  for (let i = 0; i < count; i++) {
    const spacer = new THREE.Group();
    spacer.rotation.y = (i / count) * Math.PI * 2 + yAngleOffset;

    const opener = new THREE.Group();
    const mesh = createPetalPoints(width, length, budColorHex, bloomColorHex);
    opener.add(mesh);
    spacer.add(opener);

    petals.push({ spacer, opener, mesh });
  }

  return petals;
}

/**
 * 生成花茎点云（三维对数微扰螺旋圆柱）
 */
function createStemPoints(colorHex: string, height = 2.4): THREE.Points {
  const radialSegments = 12;
  const heightSegments = 100;
  const positions: number[] = [];
  const colors: number[] = [];
  const baseColor = new THREE.Color(colorHex);

  for (let h = 0; h <= heightSegments; h++) {
    const frac = h / heightSegments;
    const y = frac * height;
    // 茎部自然微弯曲 S 型曲线
    const curveX = Math.sin(frac * Math.PI * 1.2) * 0.08;
    const curveZ = Math.cos(frac * Math.PI * 0.9) * 0.05;
    // 从底部到顶部逐渐收细
    const r = THREE.MathUtils.lerp(0.052, 0.032, frac);

    for (let s = 0; s < radialSegments; s++) {
      const angle = (s / radialSegments) * Math.PI * 2;
      const x = curveX + Math.cos(angle) * r + (Math.random() - 0.5) * 0.005;
      const z = curveZ + Math.sin(angle) * r + (Math.random() - 0.5) * 0.005;

      positions.push(x, y, z);
      const c = baseColor.clone().offsetHSL(0, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);
      colors.push(c.r, c.g, c.b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.022,
    map: pointTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

/**
 * 生成花蕊点云（基于斐波那契叶序黄金角螺旋半球）
 */
function createCenterPistilPoints(colorHex: string, count = 750, radius = 0.18): THREE.Points {
  const positions: number[] = [];
  const colors: number[] = [];
  const baseColor = new THREE.Color(colorHex);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // 137.507764度

  for (let i = 0; i < count; i++) {
    const rFrac = Math.sqrt(i / count);
    const r = rFrac * radius;
    const theta = i * goldenAngle;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    // 半球冠状凸起
    const y = Math.sqrt(Math.max(0, radius * radius - r * r)) * 0.7 + (Math.random() - 0.5) * 0.006;

    positions.push(x, y, z);
    const c = baseColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.15);
    colors.push(c.r, c.g, c.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.026,
    map: pointTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

/**
 * 生成叶片点云
 */
function createLeafPoints(colorHex: string): THREE.Points {
  const uSteps = 20;
  const vSteps = 12;
  const positions: number[] = [];
  const colors: number[] = [];
  const baseColor = new THREE.Color(colorHex);

  const length = 0.45;
  const maxWidth = 0.16;

  for (let i = 0; i <= uSteps; i++) {
    const u = i / uSteps;
    const w = maxWidth * Math.sin(u * Math.PI);

    for (let j = 0; j <= vSteps; j++) {
      const v = (j / vSteps) * 2 - 1;
      const x = v * (w * 0.5);
      const y = u * length;
      const z = -0.12 * (u * u) + (Math.random() - 0.5) * 0.006;

      positions.push(x, y, z);
      const c = baseColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
      colors.push(c.r, c.g, c.b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.022,
    map: pointTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

/**
 * 生成环境浮游微光粒子
 */
function createAmbientSparks(colorHex: string, count = 450): THREE.Points {
  const positions: number[] = [];
  const colors: number[] = [];
  const baseColor = new THREE.Color(colorHex);

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 5.0;
    const y = Math.random() * 4.0;
    const z = (Math.random() - 0.5) * 5.0;

    positions.push(x, y, z);
    const c = baseColor.clone().offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.2);
    colors.push(c.r, c.g, c.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.025,
    map: pointTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

// ── Build Flower Object Hierarchy ───────────────────────────────────
function buildFlowerHierarchy(theme: FlowerTheme) {
  if (flowerGroup) {
    scene.remove(flowerGroup);
  }
  if (sparkPoints) {
    scene.remove(sparkPoints);
  }

  currentTheme = theme;
  flowerGroup = new THREE.Group();

  // 1. 花茎
  stemMesh = createStemPoints(theme.colors.stem, 2.4);
  stemMesh.scale.y = 0.001;
  flowerGroup.add(stemMesh);

  // 2. 花头挂载节点
  headGroup = new THREE.Group();
  flowerGroup.add(headGroup);

  // 3. 花蕊
  centerMesh = createCenterPistilPoints(theme.colors.pistil, 700, 0.16);
  centerMesh.scale.setScalar(0.001);
  headGroup.add(centerMesh);

  // 4. 内层花瓣
  innerPetals = buildPetalRing(
    theme.geometry.innerCount,
    theme.geometry.petalWidth * 0.85,
    theme.geometry.petalLength * 0.82,
    theme.colors.bud,
    theme.colors.bloom,
    0
  );
  innerPetals.forEach((p) => headGroup.add(p.spacer));

  // 5. 外层花瓣（角度错开半个周期）
  outerPetals = buildPetalRing(
    theme.geometry.outerCount,
    theme.geometry.petalWidth,
    theme.geometry.petalLength,
    theme.colors.bud,
    theme.colors.bloom,
    Math.PI / theme.geometry.outerCount
  );
  outerPetals.forEach((p) => headGroup.add(p.spacer));

  // 6. 茎秆两侧叶片
  const leafCfgs = [
    { heightFraction: 0.38, yRot: 0.4, zTilt: -0.55, targetScale: 1.5 },
    { heightFraction: 0.62, yRot: Math.PI + 0.6, zTilt: -0.48, targetScale: 1.25 }
  ];

  leavesList = leafCfgs.map((cfg) => {
    const group = new THREE.Group();
    const mesh = createLeafPoints(theme.colors.leaves);
    mesh.position.x = 0.06;
    mesh.rotation.z = cfg.zTilt;
    group.add(mesh);
    group.rotation.y = cfg.yRot;
    group.scale.setScalar(0.001);

    flowerGroup.add(group);
    return { group, heightFraction: cfg.heightFraction, targetScale: cfg.targetScale, mesh };
  });

  scene.add(flowerGroup);

  // 7. 环境微光浮游光点
  sparkPoints = createAmbientSparks(theme.colors.spark, 450);
  scene.add(sparkPoints);
}

// ── Animation Loop (Bloom & Idle Breathing) ─────────────────────────
function updateBloomAnimation(dt: number) {
  animTime += dt;
  if (animTime - props.initialDelay < 0) return;

  if (!isBloomed) {
    bloomProgress = Math.min(1, bloomProgress + dt / props.bloomDuration);
    if (bloomProgress >= 1) {
      isBloomed = true;
      emit('bloom-complete');
    }
  }

  const stemHeight = 2.4;

  // --- 1. 茎秆生长 ---
  const stemT = easeOutQuad(remap(bloomProgress, PHASE.stem[0], PHASE.stem[1]));
  stemMesh.scale.y = THREE.MathUtils.lerp(0.001, 1, stemT);
  const currentStemH = stemMesh.scale.y * stemHeight;
  headGroup.position.y = currentStemH;

  // --- 2. 叶片展开 ---
  const leafT = easeOutQuad(remap(bloomProgress, PHASE.leaf[0], PHASE.leaf[1]));
  leavesList.forEach((lf) => {
    lf.group.position.y = lf.heightFraction * currentStemH;
    const s = THREE.MathUtils.lerp(0.001, lf.targetScale, leafT);
    lf.group.scale.setScalar(s);
  });

  // --- 3. 花蕊凝聚发散 ---
  const cT = easeInOutCubic(remap(bloomProgress, PHASE.center[0], PHASE.center[1]));
  const cs = THREE.MathUtils.lerp(0.001, 1, cT);
  centerMesh.scale.set(cs, cs * 0.8, cs);

  // --- 4. 内层花瓣展开 ---
  const iT = easeOutBack(remap(bloomProgress, PHASE.inner[0], PHASE.inner[1]));
  innerPetals.forEach((p) => {
    p.opener.rotation.x = iT * currentTheme.geometry.openAngleInner;
  });

  // --- 5. 外层花瓣展开 ---
  const oT = easeOutBack(remap(bloomProgress, PHASE.outer[0], PHASE.outer[1]));
  outerPetals.forEach((p) => {
    p.opener.rotation.x = oT * currentTheme.geometry.openAngleOuter;
  });

  // --- 6. 顶点颜色渐变过渡 (花苞 -> 霓虹绽放) ---
  const colT = easeInOutCubic(remap(bloomProgress, PHASE.color[0], PHASE.color[1]));
  updatePetalVertexColors(innerPetals, colT);
  updatePetalVertexColors(outerPetals, colT);

  // --- 7. 绽放完成后的呼吸与环境微风扰动 (Idle Breathing) ---
  if (isBloomed) {
    applyIdleBreathing(animTime);
  }

  // --- 8. 浮游光点漂浮流转 ---
  if (sparkPoints) {
    sparkPoints.rotation.y = animTime * 0.04;
    const posAttr = sparkPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    for (let i = 1; i < posArr.length; i += 3) {
      posArr[i] += Math.sin(animTime * 1.5 + i) * 0.0015;
    }
    posAttr.needsUpdate = true;
  }
}

/**
 * 动态插值花瓣点云顶点颜色
 */
function updatePetalVertexColors(
  petals: Array<{ mesh: THREE.Points }>,
  progress: number
) {
  petals.forEach((p) => {
    const geo = p.mesh.geometry;
    const colAttr = geo.getAttribute('color') as THREE.BufferAttribute;
    const origCols = geo.userData.originalColors as { bud: THREE.Color; bloom: THREE.Color }[];
    const colArr = colAttr.array as Float32Array;

    for (let i = 0; i < origCols.length; i++) {
      const { bud, bloom } = origCols[i];
      const mixed = bud.clone().lerp(bloom, progress);
      colArr[i * 3 + 0] = mixed.r;
      colArr[i * 3 + 1] = mixed.g;
      colArr[i * 3 + 2] = mixed.b;
    }
    colAttr.needsUpdate = true;
  });
}

/**
 * 稳态正弦呼吸与错落波动
 */
function applyIdleBreathing(t: number) {
  // 整体微摆动
  flowerGroup.rotation.z = Math.sin(t * 0.7) * 0.025;
  flowerGroup.rotation.x = Math.sin(t * 0.5 + 1.0) * 0.018;

  // 内层花瓣起伏
  innerPetals.forEach((p, i) => {
    const phase = (i / innerPetals.length) * Math.PI * 2;
    p.opener.rotation.x =
      currentTheme.geometry.openAngleInner + Math.sin(t * 1.2 + phase) * 0.035;
  });

  // 外层花瓣起伏
  outerPetals.forEach((p, i) => {
    const phase = (i / outerPetals.length) * Math.PI * 2;
    p.opener.rotation.x =
      currentTheme.geometry.openAngleOuter + Math.sin(t * 0.9 + phase) * 0.028;
  });
}

// ── Replay Function (外部可调用) ────────────────────────────────────
function replayBloom() {
  animTime = 0;
  bloomProgress = 0;
  isBloomed = false;

  if (!flowerGroup) return;
  flowerGroup.rotation.set(0, 0, 0);
  stemMesh.scale.y = 0.001;
  headGroup.position.y = 0;
  centerMesh.scale.set(0.001, 0.001, 0.001);

  innerPetals.forEach((p) => {
    p.opener.rotation.x = 0;
  });
  outerPetals.forEach((p) => {
    p.opener.rotation.x = 0;
  });
  leavesList.forEach((lf) => {
    lf.group.scale.setScalar(0.001);
    lf.group.position.y = 0;
  });

  updatePetalVertexColors(innerPetals, 0);
  updatePetalVertexColors(outerPetals, 0);
}

defineExpose({
  replayBloom
});

// ── Lifecycle & Scene Setup ─────────────────────────────────────────
onMounted(() => {
  const container = canvasContainerRef.value;
  if (!container) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050508);
  scene.fog = new THREE.FogExp2(0x050508, 0.08);

  // 2. Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 2.2, 5.0);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  // 4. Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.8, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 2.5;
  controls.maxDistance = 8.0;
  controls.maxPolarAngle = Math.PI / 2 + 0.15;
  controls.autoRotate = props.autoRotate;
  controls.autoRotateSpeed = 0.6;
  controls.enabled = props.interactive;
  controls.update();

  // 5. Postprocessing (UnrealBloomPass for Neon Glow)
  const renderPass = new RenderPass(scene, camera);
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.75, // Strength (发光强度)
    0.65, // Radius (辉光半径)
    0.12  // Threshold (发光阈值)
  );

  const outputPass = new OutputPass();

  composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  // 6. Particle Sprite Texture
  pointTexture = createParticleTexture();

  // 7. Initial Build
  const initialTheme = FLOWER_THEMES[props.themeId] || FLOWER_THEMES[DEFAULT_THEME_ID];
  buildFlowerHierarchy(initialTheme);

  // 8. Clock & Render Loop
  clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);

    updateBloomAnimation(delta);
    controls.update();
    composer.render();
  }

  animate();

  // 9. Resize Listener
  window.addEventListener('resize', handleResize);
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
  () => props.themeId,
  (newId) => {
    if (!scene) return;
    const targetTheme = FLOWER_THEMES[newId] || FLOWER_THEMES[DEFAULT_THEME_ID];
    buildFlowerHierarchy(targetTheme);
    replayBloom();
  }
);

watch(
  () => props.autoRotate,
  (val) => {
    if (controls) controls.autoRotate = val;
  }
);

watch(
  () => props.interactive,
  (val) => {
    if (controls) controls.enabled = val;
  }
);

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', handleResize);
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
.bg-radial-vignette {
  background: radial-gradient(circle at center, transparent 30%, rgba(5, 5, 8, 0.7) 90%);
}
</style>
