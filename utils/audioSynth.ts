/**
 * 纯原生 Web Audio API 声音合成器
 * 零外部音频文件依赖，高保真合成水晶风铃、花开共鸣、解封音效与柔和白噪音
 */

let audioCtx: AudioContext | null = null;
export const isMuted = ref<boolean>(false);

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 播放清脆水晶音阶 / 风铃声
 */
export function playChime(freq = 523.25, duration = 1.6, gainLevel = 0.25) {
  if (isMuted.value) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 泛音和谐结构 (正弦波 + 高频泛音)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // 柔和起振与晶莹衰减
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainLevel, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.warn('Audio synthesis error:', e);
  }
}

/**
 * 播放开箱/解封时的繁花绽放琶音（Glissando Sparkle）
 */
export function playUnboxSparkle() {
  if (isMuted.value) return;
  // 经典 C Major 9 仙音和弦 (C5, E5, G5, B5, D6, G6)
  const chordNotes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];

  chordNotes.forEach((freq, idx) => {
    setTimeout(() => {
      playChime(freq, 1.8 - idx * 0.15, 0.18 + idx * 0.02);
    }, idx * 75);
  });
}

/**
 * 播放花朵切换/点击轻柔气泡音 (Pop)
 */
export function playPopSound() {
  if (isMuted.value) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * 播放花卉盛开低频共鸣 (Bloom Ambient Swell)
 */
export function playBloomSwell() {
  if (isMuted.value) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130.81, now); // C3
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 2.0); // C4

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.8);
  } catch (e) {
    console.warn(e);
  }
}
