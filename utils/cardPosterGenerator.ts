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
 * 辅助函数：绘制朱砂印章
 */
function drawSeal(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 32) {
  ctx.save();
  ctx.fillStyle = 'rgba(200, 60, 60, 0.9)';
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, x, y, size, size, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(size * 0.48)}px "Noto Serif SC", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + size / 2, y + size / 2);
  ctx.restore();
}

/**
 * 辅助函数：自动换行绘制古风文本
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
 * 生成东方古风高清花笺画轴 (1080 x 1560)
 */
export async function generateCardPoster(options: CardPosterOptions): Promise<string> {
  const width = 1080;
  const height = 1560;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. 尝试绘制背景 bg.jpg，若无则使用玄黑墨韵渐变
  try {
    const bgImg = await loadImage('/bg.jpg');
    ctx.drawImage(bgImg, 0, 0, width, height);
    // 覆盖一层轻柔墨韵微光
    ctx.fillStyle = 'rgba(11, 12, 16, 0.65)';
    ctx.fillRect(0, 0, width, height);
  } catch (e) {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0b0c10');
    bgGrad.addColorStop(0.5, '#161822');
    bgGrad.addColorStop(1, '#08090d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. 主题中心古典鎏金/琉璃光晕
  const glowGrad = ctx.createRadialGradient(width / 2, 480, 20, width / 2, 480, 440);
  glowGrad.addColorStop(0, `${options.modelInfo.accentColor}40`);
  glowGrad.addColorStop(0.6, `${options.modelInfo.glowColor || options.modelInfo.accentColor}18`);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, 1000);

  // 浮游金屑微粒
  ctx.fillStyle = '#fde68a';
  for (let i = 0; i < 65; i++) {
    const sx = Math.sin(i * 77) * 0.5 + 0.5;
    const sy = Math.cos(i * 44) * 0.5 + 0.5;
    const sa = (Math.sin(i * 15) * 0.5 + 0.5) * 0.45;
    ctx.globalAlpha = sa;
    ctx.beginPath();
    ctx.arc(sx * width, sy * height, (i % 3) + 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // 3. 古典回纹与双层金丝画框
  ctx.save();
  ctx.strokeStyle = 'rgba(226, 156, 54, 0.4)';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 40, 40, width - 80, height - 80, 32);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(226, 156, 54, 0.15)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 48, 48, width - 96, height - 96, 26);
  ctx.stroke();

  // 四角回纹祥云 ✦
  ctx.fillStyle = '#f59e0b';
  ctx.font = '18px "Noto Serif SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❖', 65, 65);
  ctx.fillText('❖', width - 65, 65);
  ctx.fillText('❖', 65, height - 65);
  ctx.fillText('❖', width - 65, height - 65);
  ctx.restore();

  // 4. 顶部古典题名
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '600 22px "Noto Serif SC", serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('✦  花 笺 记 · 芳 华 锦 书  ✦', width / 2, 105);

  ctx.fillStyle = 'rgba(253, 230, 138, 0.6)';
  ctx.font = '300 12px "Noto Serif SC", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('3D IMMERSIVE FLORAL LETTER · 东方古韵', width / 2, 134);

  // 细金分隔线
  ctx.strokeStyle = 'rgba(226, 156, 54, 0.3)';
  ctx.beginPath();
  ctx.moveTo(width / 2 - 160, 152);
  ctx.lineTo(width / 2 + 160, 152);
  ctx.stroke();
  ctx.restore();

  // 5. 3D 花卉画中仙境 (Snapshot)
  if (options.snapshotDataUrl) {
    try {
      const flowerImg = await loadImage(options.snapshotDataUrl);
      const imgSize = 580;
      const imgX = (width - imgSize) / 2;
      const imgY = 170;

      ctx.save();
      // 月洞门底托微光
      const shadowGrad = ctx.createRadialGradient(width / 2, imgY + imgSize - 50, 10, width / 2, imgY + imgSize - 50, 240);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
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

  // 6. 花卉名称与花语 Banner
  ctx.save();
  ctx.textAlign = 'center';

  // 类别印记微胶囊
  ctx.fillStyle = 'rgba(226, 156, 54, 0.15)';
  ctx.strokeStyle = 'rgba(226, 156, 54, 0.5)';
  ctx.lineWidth = 1;
  const tagWidth = 150;
  const tagHeight = 32;
  drawRoundedRect(ctx, (width - tagWidth) / 2, 750, tagWidth, tagHeight, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fde68a';
  ctx.font = '500 14px "Noto Serif SC", serif';
  ctx.fillText(`品类 · ${options.modelInfo.categoryLabel}`, width / 2, 772);

  // 花名
  ctx.fillStyle = '#fffbeb';
  ctx.font = '700 40px "Noto Serif SC", serif';
  ctx.fillText(options.modelInfo.name, width / 2, 825);

  // 诗意题跋
  ctx.fillStyle = '#fcd34d';
  ctx.font = 'italic 400 18px "Noto Serif SC", serif';
  ctx.fillText(`“ ${options.modelInfo.tagline} ”`, width / 2, 865);
  ctx.restore();

  // 7. 尺素寄语卡片区域 (宣纸绢帛暗纹框)
  const cardX = 90;
  const cardY = 910;
  const cardW = width - 180;
  const cardH = 430;

  ctx.save();
  // 卡片背景与边框
  ctx.fillStyle = 'rgba(15, 17, 24, 0.75)';
  ctx.strokeStyle = 'rgba(226, 156, 54, 0.35)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.stroke();

  // 称呼 (Recipient)
  let textStartY = cardY + 52;
  if (options.recipient) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fef3c7';
    ctx.font = '600 21px "Noto Serif SC", serif';
    ctx.fillText(`致 · ${options.recipient} 雅鉴：`, cardX + 36, textStartY);
    textStartY += 44;
  }

  // 正文内容 (Message)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fde68a';
  ctx.font = '300 19px "Noto Serif SC", serif';
  const displayMsg = options.message || options.modelInfo.defaultMessage;
  const nextY = wrapText(ctx, displayMsg, cardX + 36, textStartY, cardW - 72, 36);

  // 署名与朱砂印章 (Sender)
  if (options.sender) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'italic 500 18px "Noto Serif SC", serif';
    const sigY = Math.max(nextY + 25, cardY + 235);
    ctx.fillText(`落款 · ${options.sender}`, cardX + cardW - 68, sigY);
    drawSeal(ctx, '吉', cardX + cardW - 55, sigY - 20, 26);
  }

  // 分隔细线
  ctx.strokeStyle = 'rgba(226, 156, 54, 0.15)';
  ctx.beginPath();
  ctx.moveTo(cardX + 28, cardY + 278);
  ctx.lineTo(cardX + cardW - 28, cardY + 278);
  ctx.stroke();

  // 8. 扫码印信与二维码
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
    const qrSize = 108;
    const qrX = cardX + 36;
    const qrY = cardY + 298;

    // 二维码金边框
    ctx.strokeStyle = 'rgba(226, 156, 54, 0.4)';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 8);
    ctx.stroke();

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // 二维码右侧文字说明
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fffbeb';
    ctx.font = '600 16px "Noto Serif SC", serif';
    ctx.fillText('扫码抚开朱印 · 直达 3D 沉浸式互动花境', qrX + qrSize + 22, qrY + 38);

    ctx.fillStyle = 'rgba(253, 230, 138, 0.7)';
    ctx.font = '300 12px monospace';
    ctx.fillText('SCAN QR CODE TO EXPERIENCE 3D BLOOM SCENE', qrX + qrSize + 22, qrY + 64);

    const dateStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    ctx.fillText(`FLORAL CERTIFICATE · 岁在此时 · ${dateStr}`, qrX + qrSize + 22, qrY + 88);
  } catch (e) {
    console.warn('Failed to generate QR code on poster:', e);
  }

  ctx.restore();

  // 9. 底部防伪编码与古卷落款
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(226, 156, 54, 0.4)';
  ctx.font = '300 11px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(`✦ 花笺密符 #BLOOM-${Date.now().toString(36).toUpperCase()} · 纯前端离线封缄 ✦`, width / 2, height - 60);
  ctx.restore();

  return canvas.toDataURL('image/png', 1.0);
}

/**
 * 浏览器一键触发下载海报
 */
export function downloadImage(dataUrl: string, filename = '3D古风花笺.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
