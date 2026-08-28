export interface FlowerTheme {
  id: string;
  name: string;
  category: string;
  tagline: string;
  defaultMessage: string;
  colors: {
    bloom: string;      // 盛开时粒子霓虹主色
    bud: string;        // 花苞初始暗色
    stem: string;       // 花茎颜色
    leaves: string;     // 叶片颜色
    pistil: string;     // 花蕊中心颜色
    spark: string;      // 周围浮游粒子颜色
    accent: string;     // UI 点缀色 (Tailwind hex)
  };
  geometry: {
    innerCount: number;
    outerCount: number;
    petalLength: number;
    petalWidth: number;
    openAngleInner: number;
    openAngleOuter: number;
  };
}

export const FLOWER_THEMES: Record<string, FlowerTheme> = {
  rose: {
    id: 'rose',
    name: '暮光红蔷薇',
    category: '爱情',
    tagline: '以粒子之火，燃炽热心愿',
    defaultMessage: '愿你的世界常有繁花相伴，满目皆是温柔与偏爱。',
    colors: {
      bloom: '#ff2a6d',
      bud: '#70092b',
      stem: '#1c4a2a',
      leaves: '#2d6a4f',
      pistil: '#ffd700',
      spark: '#ff70a6',
      accent: '#ff2a6d'
    },
    geometry: {
      innerCount: 5,
      outerCount: 8,
      petalLength: 0.85,
      petalWidth: 0.42,
      openAngleInner: Math.PI / 2.2,
      openAngleOuter: Math.PI / 1.85
    }
  },
  lavender: {
    id: 'lavender',
    name: '极光薰衣草',
    category: '疗愈',
    tagline: '静谧如星海，抚平所有波澜',
    defaultMessage: '愿晚风吹散所有的疲惫与喧嚣，留下一夜清澈与安宁。',
    colors: {
      bloom: '#c084fc',
      bud: '#581c87',
      stem: '#1c4a2a',
      leaves: '#2d6a4f',
      pistil: '#f3e8ff',
      spark: '#e9d5ff',
      accent: '#a855f7'
    },
    geometry: {
      innerCount: 6,
      outerCount: 10,
      petalLength: 0.9,
      petalWidth: 0.32,
      openAngleInner: Math.PI / 2.4,
      openAngleOuter: Math.PI / 1.9
    }
  },
  sunflower: {
    id: 'sunflower',
    name: '曜日向日葵',
    category: '支持',
    tagline: '永远迎着光的方向，生生不息',
    defaultMessage: '请相信自己的力量，阴霾终会散去，阳光为你而来。',
    colors: {
      bloom: '#fbbf24',
      bud: '#92400e',
      stem: '#166534',
      leaves: '#22c55e',
      pistil: '#451a03',
      spark: '#fde047',
      accent: '#f59e0b'
    },
    geometry: {
      innerCount: 8,
      outerCount: 13,
      petalLength: 0.95,
      petalWidth: 0.28,
      openAngleInner: Math.PI / 2.1,
      openAngleOuter: Math.PI / 1.75
    }
  },
  sakura: {
    id: 'sakura',
    name: '落樱绯雪',
    category: '友谊',
    tagline: '春水初生，感谢一路并肩的温暖',
    defaultMessage: '时光荏苒，很高兴能与你在这浩瀚世界中相遇同行。',
    colors: {
      bloom: '#f472b6',
      bud: '#831843',
      stem: '#1c4a2a',
      leaves: '#4ade80',
      pistil: '#fce7f3',
      spark: '#fbcfe8',
      accent: '#ec4899'
    },
    geometry: {
      innerCount: 5,
      outerCount: 5,
      petalLength: 0.75,
      petalWidth: 0.45,
      openAngleInner: Math.PI / 2.3,
      openAngleOuter: Math.PI / 1.8
    }
  },
  tulip: {
    id: 'tulip',
    name: '晨曦郁金香',
    category: '庆祝',
    tagline: '每一次盛开，都是值得祝贺的奇迹',
    defaultMessage: '愿你所愿皆得，万事胜意，在这个特别的时刻尽情绽放光彩！',
    colors: {
      bloom: '#fb923c',
      bud: '#9a3412',
      stem: '#15803d',
      leaves: '#22c55e',
      pistil: '#fef08a',
      spark: '#fdba74',
      accent: '#f97316'
    },
    geometry: {
      innerCount: 3,
      outerCount: 6,
      petalLength: 0.9,
      petalWidth: 0.48,
      openAngleInner: Math.PI / 2.6,
      openAngleOuter: Math.PI / 2.1
    }
  },
  hydrangea: {
    id: 'hydrangea',
    name: '幽夜绣球',
    category: '感谢',
    tagline: '微光聚成星河，寄予由衷谢意',
    defaultMessage: '千言万语化作这一簇星芒，感谢你一直以来的善意与陪伴。',
    colors: {
      bloom: '#38bdf8',
      bud: '#0369a1',
      stem: '#1c4a2a',
      leaves: '#10b981',
      pistil: '#e0f2fe',
      spark: '#7dd3fc',
      accent: '#0ea5e9'
    },
    geometry: {
      innerCount: 7,
      outerCount: 12,
      petalLength: 0.78,
      petalWidth: 0.36,
      openAngleInner: Math.PI / 2.2,
      openAngleOuter: Math.PI / 1.8
    }
  }
};

export const THEME_LIST = Object.values(FLOWER_THEMES);
export const DEFAULT_THEME_ID = 'rose';
