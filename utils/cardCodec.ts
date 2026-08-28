import LZString from 'lz-string';
import { DEFAULT_MODEL_ID, getFlowerModelById } from '~/constants/models';

export interface FlowerCardPayload {
  v: number;          // 数据版本号 (如 2)
  mid: string;        // 3D 模型 ID (如 'bouquet', 'orchid_flower', 'lotus_flower_by_geometry_nodes')
  m?: string;         // 留言内容 (可选)
  s?: string;         // 发送人署名 (可选)
  r?: string;         // 接收人称呼 (可选)
  c?: number;         // 创建时间戳
}

// 默认兜底卡片数据
export const DEFAULT_CARD_DATA: FlowerCardPayload = {
  v: 2,
  mid: DEFAULT_MODEL_ID,
  m: getFlowerModelById(DEFAULT_MODEL_ID).defaultMessage,
  c: Date.now()
};

/**
 * 将卡片结构压缩编码为 URL-Safe 字符串
 */
export function encodeCardData(data: Partial<FlowerCardPayload>): string {
  try {
    const cleanObject: Partial<FlowerCardPayload> = {
      v: data.v || 2,
      mid: data.mid || DEFAULT_MODEL_ID,
      c: data.c || Date.now()
    };

    if (data.m && data.m.trim()) cleanObject.m = data.m.trim();
    if (data.s && data.s.trim()) cleanObject.s = data.s.trim();
    if (data.r && data.r.trim()) cleanObject.r = data.r.trim();

    const jsonStr = JSON.stringify(cleanObject);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error('[CardCodec] 编码失败:', err);
    return '';
  }
}

/**
 * 从 URL 参数解压还原卡片数据
 */
export function decodeCardData(encodedStr: string | null | undefined): FlowerCardPayload {
  if (!encodedStr) return { ...DEFAULT_CARD_DATA, c: Date.now() };

  try {
    const jsonStr = LZString.decompressFromEncodedURIComponent(encodedStr);
    if (!jsonStr) return { ...DEFAULT_CARD_DATA, c: Date.now() };

    const parsed = JSON.parse(jsonStr) as any;

    // 兼容旧版 t (theme) 参数映射到 mid
    const modelId = parsed.mid || (parsed.t === 'sunflower' ? 'margarita_flower' : parsed.t === 'lavender' ? 'orchid_flower' : parsed.t === 'tulip' ? 'flowers_with_the_vase' : parsed.t) || DEFAULT_MODEL_ID;

    return {
      v: parsed.v || 2,
      mid: modelId,
      m: parsed.m,
      s: parsed.s,
      r: parsed.r,
      c: parsed.c || Date.now()
    };
  } catch (err) {
    console.error('[CardCodec] 解码失败，回退到默认数据:', err);
    return { ...DEFAULT_CARD_DATA, c: Date.now() };
  }
}

/**
 * 生成带有压缩数据的完整分享链接
 */
export function generateShareUrl(data: Partial<FlowerCardPayload>, baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const code = encodeCardData(data);
  return `${origin}/receive?d=${code}`;
}
