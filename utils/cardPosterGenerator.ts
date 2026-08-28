import QRCode from 'qrcode';
import type { FlowerModelInfo } from '~/constants/models';

export interface CardPosterOptions {
  modelInfo: FlowerModelInfo;
  message: string;
  sender?: string;
  recipient?: string;
  shareUrl: string;
  snapshotDataUrl?: string;
}

/**
 * 辅助函数：加载图片为 HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * 辅助函数：绘制圆角矩形路径
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * 辅助函数：自动换行绘制文本
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = text.split('');
  let line = '';
  let currentY = y;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = chars[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

/**
 * 生成高分辨率贺卡海报 (1080 x 1560)
 */
export async function generateCardPoster(options: CardPosterOptions): Promise<string> {
  const width = 1080;
  const height = 1560;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. 深度暗夜背景与氛围微光
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#06070b');
  bgGrad.addColorStop(0.5, '#0a0c13');
  bgGrad.addColorStop(1, '#050508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 主题中心辐射光晕
  const glowGrad = ctx.createRadialGradient(width / 2, 480, 20, width / 2, 480, 420);
  glowGrad.addColorStop(0, `${options.modelInfo.accentColor}35`);
  glowGrad.addColorStop(0.5, `${options.modelInfo.glowColor || options.modelInfo.accentColor}15`);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, 1000);

  // 浮游微光星斑
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 60; i++) {
    const sx = Math.sin(i * 99) * 0.5 + 0.5;
    const sy = Math.cos(i * 33) * 0.5 + 0.5;
    const sa = (Math.sin(i * 12) * 0.5 + 0.5) * 0.4;
    ctx.globalAlpha = sa;
    ctx.beginPath();
    ctx.arc(sx * width, sy * height, (i % 3) + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // 2. 双层奢华边框
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 40, 40, width - 80, height - 80, 36);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 48, 48, width - 96, height - 96, 30);
  ctx.stroke();

  // 四角装饰 ✦
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', 65, 65);
  ctx.fillText('✦', width - 65, 65);
  ctx.fillText('✦', 65, height - 65);
  ctx.fillText('✦', width - 65, height - 65);
  ctx.restore();

  // 3. 顶部品牌与标语
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '500 18px Cinzel, "Noto Serif SC", serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('✦  D I G I T A L   B L O O M  ✦', width / 2, 105);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '300 12px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('3D IMMERSIVE DIGITAL GREETING CARD', width / 2, 132);

  // 细分隔线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, 152);
  ctx.lineTo(width / 2 + 140, 152);
  ctx.stroke();
  ctx.restore();

  // 4. 3D 花卉主视觉 (Snapshot)
  if (options.snapshotDataUrl) {
    try {
      const flowerImg = await loadImage(options.snapshotDataUrl);
      const imgSize = 580;
      const imgX = (width - imgSize) / 2;
      const imgY = 170;

      ctx.save();
      // 底部花托微阴影
      const shadowGrad = ctx.createRadialGradient(width / 2, imgY + imgSize - 60, 10, width / 2, imgY + imgSize - 60, 220);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      shadowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(imgX - 40, imgY + imgSize - 120, imgSize + 80, 120);

      // 绘制 3D 模型
      ctx.drawImage(flowerImg, imgX, imgY, imgSize, imgSize);
      ctx.restore();
    } catch (e) {
      console.warn('Failed to draw 3D snapshot on poster:', e);
    }
  }

  // 5. 花卉名称与花语 Banner
  ctx.save();
  ctx.textAlign = 'center';

  // 类别微胶囊
  ctx.fillStyle = `${options.modelInfo.accentColor}20`;
  ctx.strokeStyle = `${options.modelInfo.accentColor}60`;
  ctx.lineWidth = 1;
  const tagWidth = 140;
  const tagHeight = 30;
  drawRoundedRect(ctx, (width - tagWidth) / 2, 750, tagWidth, tagHeight, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = options.modelInfo.accentColor;
  ctx.font = '500 13px "Noto Serif SC", sans-serif';
  ctx.fillText(options.modelInfo.categoryLabel, width / 2, 770);

  // 花名
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 38px "Noto Serif SC", Cinzel, serif';
  ctx.fillText(options.modelInfo.name, width / 2, 825);

  // 花语 Tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = 'italic 300 18px "Noto Serif SC", serif';
  ctx.fillText(`“ ${options.modelInfo.tagline} ”`, width / 2, 865);
  ctx.restore();

  // 6. 寄语卡片区域 (Frosted Glass Box)
  const cardX = 90;
  const cardY = 910;
  const cardW = width - 180;
  const cardH = 430;

  ctx.save();
  // 卡片背景与边框
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.stroke();

  // 称呼 (Recipient)
  let textStartY = cardY + 50;
  if (options.recipient) {
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '600 20px "Noto Serif SC", serif';
    ctx.fillText(`致 ${options.recipient}：`, cardX + 36, textStartY);
    textStartY += 42;
  }

  // 正文内容 (Message)
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '300 19px "Noto Serif SC", serif';
  const displayMsg = options.message || options.modelInfo.defaultMessage;
  const nextY = wrapText(ctx, displayMsg, cardX + 36, textStartY, cardW - 72, 34);

  // 署名 (Sender)
  if (options.sender) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = 'italic 400 18px "Noto Serif SC", serif';
    ctx.fillText(`—— ${options.sender}`, cardX + cardW - 36, Math.max(nextY + 25, cardY + 230));
  }

  // 分隔细线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.beginPath();
  ctx.moveTo(cardX + 28, cardY + 275);
  ctx.lineTo(cardX + cardW - 28, cardY + 275);
  ctx.stroke();

  // 7. 二维码与互动引导
  try {
    const qrDataUrl = await QRCode.toDataURL(options.shareUrl, {
      width: 120,
      margin: 1,
      color: {
        dark: '#ffffff',
        light: '#00000000'
      }
    });
    const qrImg = await loadImage(qrDataUrl);
    const qrSize = 110;
    const qrX = cardX + 36;
    const qrY = cardY + 295;

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // 二维码右侧文字说明
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 15px "Noto Serif SC", sans-serif';
    ctx.fillText('扫码开启 3D 沉浸式互动花束', qrX + qrSize + 22, qrY + 38);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '300 12px monospace';
    ctx.fillText('SCAN TO EXPERIENCE 3D BLOOM & WISHES', qrX + qrSize + 22, qrY + 64);

    const dateStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    ctx.fillText(`DIGITAL BLOOM CERTIFICATE · ${dateStr}`, qrX + qrSize + 22, qrY + 88);
  } catch (e) {
    console.warn('Failed to generate QR code on poster:', e);
  }

  ctx.restore();

  // 8. 底部防伪编码与版权
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = '300 11px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(`TOKEN #BLOOM-${Date.now().toString(36).toUpperCase()} · PURE CLIENT ENCRYPTION`, width / 2, height - 60);
  ctx.restore();

  return canvas.toDataURL('image/png', 1.0);
}

/**
 * 浏览器一键触发下载海报
 */
export function downloadImage(dataUrl: string, filename = 'DigitalBloom_Card.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
