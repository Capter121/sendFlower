export interface FlowerModelInfo {
  id: string;
  file: string;
  name: string;
  category: 'bouquet' | 'rose' | 'vase' | 'lotus' | 'sakura' | 'peony' | 'fantasy';
  categoryLabel: string;
  tagline: string;
  defaultMessage: string;
  accentColor: string;
  glowColor: string;
  targetScale?: number;
  cameraDistance?: number;
}

export const FLOWER_MODELS: FlowerModelInfo[] = [
  // ── 💐 繁花玉锦 (Bouquets) ───────────────────────────
  {
    id: 'bouquet',
    file: 'bouquet.glb',
    name: '繁花似锦 · 典雅花束',
    category: 'bouquet',
    categoryLabel: '繁花玉锦',
    tagline: '把世间所有美好，都捧到你面前',
    defaultMessage: '为你捧来一束永不凋零的东方繁花，愿喜乐长宁，岁岁常欢愉。',
    accentColor: '#e07a5f',
    glowColor: '#fed7aa',
    targetScale: 2.3,
    cameraDistance: 4.5
  },
  {
    id: 'tulips_and_carnations_in_a_vase',
    file: 'tulips_and_carnations_in_a_vase.glb',
    name: '青花春晓 · 郁金华宴',
    category: 'bouquet',
    categoryLabel: '繁花玉锦',
    tagline: '春风拂槛露华浓，百花争妍映暖阳',
    defaultMessage: '郁金吐秀，康宁长随。愿君前程似锦，岁序长安。',
    accentColor: '#f59e0b',
    glowColor: '#fef08a',
    targetScale: 2.2,
    cameraDistance: 4.6
  },
  {
    id: 'flower_delicate',
    file: 'flower_delicate.glb',
    name: '素心芳华 · 琼枝玉叶',
    category: 'bouquet',
    categoryLabel: '繁花玉锦',
    tagline: '淡泊以明志，宁静而致远',
    defaultMessage: '采撷一抹淡雅清香，寄予最珍贵的你。',
    accentColor: '#d97706',
    glowColor: '#fde68a',
    targetScale: 2.2,
    cameraDistance: 4.5
  },

  // ── 🌹 绛雪红芳 (Roses) ──────────────────────────────
  {
    id: 'rose',
    file: 'rose.glb',
    name: '朱砂深红 · 傲雪寒玫',
    category: 'rose',
    categoryLabel: '绛雪红芳',
    tagline: '红豆生南国，春来发几枝',
    defaultMessage: '山水万程，所愿皆你。以此一朵深红，表我长久深情。',
    accentColor: '#be123c',
    glowColor: '#fda4af',
    targetScale: 2.3,
    cameraDistance: 4.2
  },
  {
    id: 'single_flower__rose_pink',
    file: 'single_flower__rose_pink.glb',
    name: '粉霞玉容 · 羞云月季',
    category: 'rose',
    categoryLabel: '绛雪红芳',
    tagline: '桃之夭夭，灼灼其华',
    defaultMessage: '愿你眼角常带温柔笑意，岁月不负韶华。',
    accentColor: '#f43f5e',
    glowColor: '#fecdd3',
    targetScale: 2.3,
    cameraDistance: 4.2
  },
  {
    id: 'single_flower__rose_blue',
    file: 'single_flower__rose_blue.glb',
    name: '碧落星海 · 幽蓝妖姬',
    category: 'rose',
    categoryLabel: '绛雪红芳',
    tagline: '九天揽月，唯你知心',
    defaultMessage: '跨越漫天星辰，将这朵极境深蓝送给独一无二的你。',
    accentColor: '#3b82f6',
    glowColor: '#bfdbfe',
    targetScale: 2.3,
    cameraDistance: 4.2
  },
  {
    id: 'single_flower__carnation_pink',
    file: 'single_flower__carnation_pink.glb',
    name: '萱草春晖 · 粉黛康乃馨',
    category: 'rose',
    categoryLabel: '绛雪红芳',
    tagline: '微风拂煦，寸草春晖',
    defaultMessage: '愿岁月温柔待你，愿福泽常伴身边。辛劳之余，多加珍重。',
    accentColor: '#ec4899',
    glowColor: '#fbcfe8',
    targetScale: 2.3,
    cameraDistance: 4.2
  },

  // ── 🏺 素瓷幽香 (Vases) ──────────────────────────────
  {
    id: 'magnolia_in_a_vase',
    file: 'magnolia_in_a_vase.glb',
    name: '玉堂富贵 · 白玉兰瓶供',
    category: 'vase',
    categoryLabel: '素瓷幽香',
    tagline: '霓裳片片晚妆新，束素亭亭玉殿春',
    defaultMessage: '玉堂生辉，兰香盈室。愿君居所安宁，福寿双全。',
    accentColor: '#eab308',
    glowColor: '#fef9c3',
    targetScale: 2.1,
    cameraDistance: 4.5
  },
  {
    id: 'flowervase',
    file: 'flowervase.glb',
    name: '素瓷静雅 · 案头幽清',
    category: 'vase',
    categoryLabel: '素瓷幽香',
    tagline: '闲坐小窗读周易，不知春去几多时',
    defaultMessage: '一樽清瓷，数枝幽香。愿君在喧嚣世间，独享一份清幽雅兴。',
    accentColor: '#d97706',
    glowColor: '#fde68a',
    targetScale: 2.2,
    cameraDistance: 4.5
  },
  {
    id: 'flowers_in_pink_vase',
    file: 'flowers_in_pink_vase.glb',
    name: '胭脂凝露 · 粉瓷春晓',
    category: 'vase',
    categoryLabel: '素瓷幽香',
    tagline: '晓看红湿处，花重锦官城',
    defaultMessage: '红瓷凝香，春意盎然。祝所愿皆所得，万事顺遂。',
    accentColor: '#f43f5e',
    glowColor: '#fecdd3',
    targetScale: 2.2,
    cameraDistance: 4.5
  },

  // ── 🪷 碧水芙蓉 (Lotus & Lilies) ─────────────────────
  {
    id: 'stylized_lotus_flower',
    file: 'stylized_lotus_flower.glb',
    name: '碧水青莲 · 亭亭净植',
    category: 'lotus',
    categoryLabel: '碧水芙蓉',
    tagline: '出淤泥而不染，濯清涟而不妖',
    defaultMessage: '青莲初绽，冰心玉壶。愿君心如明镜，安然自若。',
    accentColor: '#10b981',
    glowColor: '#a7f3d0',
    targetScale: 2.4,
    cameraDistance: 4.0
  },
  {
    id: 'lily',
    file: 'lily.glb',
    name: '素白幽香 · 冰肌百合',
    category: 'lotus',
    categoryLabel: '碧水芙蓉',
    tagline: '尔丛香霭翠席间，独秀群芳未觉凡',
    defaultMessage: '百事合意，福泽绵长。愿生活纯粹如白雪，静好如初。',
    accentColor: '#f8fafc',
    glowColor: '#e2e8f0',
    targetScale: 2.3,
    cameraDistance: 4.2
  },
  {
    id: 'lilies',
    file: 'lilies.glb',
    name: '并蒂双清 · 幽谷水仙',
    category: 'lotus',
    categoryLabel: '碧水芙蓉',
    tagline: '同气连枝，琴瑟和鸣',
    defaultMessage: '同心合意，福泽永随。祝君百年好合，情深似海。',
    accentColor: '#059669',
    glowColor: '#6ee7b7',
    targetScale: 2.2,
    cameraDistance: 4.4
  },
  {
    id: 'generic_narcissus_flower',
    file: 'generic_narcissus_flower.glb',
    name: '凌波仙子 · 案头金盏',
    category: 'lotus',
    categoryLabel: '碧水芙蓉',
    tagline: '借水开花自一奇，水沉为骨玉为肌',
    defaultMessage: '凌波微步，罗袜生尘。祝新岁迎祥纳福，诸事吉祥。',
    accentColor: '#f59e0b',
    glowColor: '#fef08a',
    targetScale: 2.3,
    cameraDistance: 4.2
  },

  // ── 🌸 桃溪落樱 (Sakura) ──────────────────────────────
  {
    id: 'sakura',
    file: 'sakura.glb',
    name: '桃溪落樱 · 初樱漫舞',
    category: 'sakura',
    categoryLabel: '桃溪落樱',
    tagline: '昨日雪如花，今日花如雪',
    defaultMessage: '落英缤纷，春风十里。愿美好与温暖如约而至。',
    accentColor: '#fb7185',
    glowColor: '#ffe4e6',
    targetScale: 2.3,
    cameraDistance: 4.5
  },
  {
    id: 'sakura_tree_01_-_low_poly_model',
    file: 'sakura_tree_01_-_low_poly_model.glb',
    name: '古刹繁樱 · 盛景如画',
    category: 'sakura',
    categoryLabel: '桃溪落樱',
    tagline: '十里春风不如你，落红成阵画堂深',
    defaultMessage: '一树繁华，万般眷恋。愿你生活绚丽如春，步步生香。',
    accentColor: '#f43f5e',
    glowColor: '#fecdd3',
    targetScale: 2.1,
    cameraDistance: 4.8
  },
  {
    id: 'tree_sakura',
    file: 'tree_sakura.glb',
    name: '绯雪落英 · 晚霞繁枝',
    category: 'sakura',
    categoryLabel: '桃溪落樱',
    tagline: '花开有时，相逢有期',
    defaultMessage: '且看漫天绯红，皆是对你的深深祝愿。',
    accentColor: '#ec4899',
    glowColor: '#fbcfe8',
    targetScale: 2.1,
    cameraDistance: 4.8
  },

  // ── 🌺 国色天香 (Peony & Roses) ──────────────────────
  {
    id: 'peche_bonbons_rose_2022_spring',
    file: 'peche_bonbons_rose_2022_spring.glb',
    name: '软香蜜糖 · 贵妃醉酒',
    category: 'peony',
    categoryLabel: '国色天香',
    tagline: '云想衣裳花想容，春风拂槛露华浓',
    defaultMessage: '国色天香，倾国倾城。愿你容颜常驻，幸福满溢。',
    accentColor: '#e11d48',
    glowColor: '#fda4af',
    targetScale: 2.3,
    cameraDistance: 4.2
  },
  {
    id: 'sharme_rose_in_2022_spring',
    file: 'sharme_rose_in_2022_spring.glb',
    name: '唯美洛神 · 浅吟粉芳',
    category: 'peony',
    categoryLabel: '国色天香',
    tagline: '翩若惊鸿，婉若游龙',
    defaultMessage: '盛放千般娇媚，尽显万种风华。',
    accentColor: '#f43f5e',
    glowColor: '#fecdd3',
    targetScale: 2.3,
    cameraDistance: 4.2
  },

  // ── ✨ 蓬莱仙卉 (Fantasy Blooms) ──────────────────────
  {
    id: 'blue_flower_animated',
    file: 'blue_flower_animated.glb',
    name: '灵犀幻海 · 流光幽梦',
    category: 'fantasy',
    categoryLabel: '蓬莱仙卉',
    tagline: '身无彩凤双飞翼，心有灵犀一点通',
    defaultMessage: '采得蓬莱一缕仙光，愿灵犀常在，心想事成。',
    accentColor: '#6366f1',
    glowColor: '#c7d2fe',
    targetScale: 2.3,
    cameraDistance: 4.2
  },
  {
    id: 'alien_flower',
    file: 'alien_flower.glb',
    name: '瑶池仙葩 · 琉璃玉魄',
    category: 'fantasy',
    categoryLabel: '蓬莱仙卉',
    tagline: '此花只应天上有，人间能得几回闻',
    defaultMessage: '赠你一朵仙境琉璃花，愿你此生万事胜意，璀璨生辉。',
    accentColor: '#8b5cf6',
    glowColor: '#ddd6fe',
    targetScale: 2.3,
    cameraDistance: 4.2
  }
];

export const DEFAULT_MODEL_ID = 'bouquet';

export const FLOWER_CATEGORIES: { id: FlowerModelInfo['category']; label: string; icon: string }[] = [
  { id: 'bouquet', label: '繁花玉锦', icon: '💐' },
  { id: 'rose', label: '绛雪红芳', icon: '🌹' },
  { id: 'vase', label: '素瓷幽香', icon: '🏺' },
  { id: 'lotus', label: '碧水芙蓉', icon: '🪷' },
  { id: 'sakura', label: '桃溪落樱', icon: '🌸' },
  { id: 'peony', label: '国色天香', icon: '🌺' },
  { id: 'fantasy', label: '蓬莱仙卉', icon: '✨' }
];

export function getFlowerModelById(id: string): FlowerModelInfo {
  const found = FLOWER_MODELS.find((m) => m.id === id);
  return found || FLOWER_MODELS[0];
}

export function getRandomFlowerModel(excludeId?: string): FlowerModelInfo {
  const pool = excludeId && FLOWER_MODELS.length > 1
    ? FLOWER_MODELS.filter((m) => m.id !== excludeId)
    : FLOWER_MODELS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || FLOWER_MODELS[0];
}

