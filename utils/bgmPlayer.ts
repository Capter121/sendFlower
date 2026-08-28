import { ref } from 'vue';
import { BGM_PLAYLIST, type MusicTrack } from '~/constants/music';

export const isBgmPlaying = ref(false);
export const currentBgmTrack = ref<MusicTrack | null>(null);
export const bgmVolume = ref(0.65);
export const isBgmInitialized = ref(false);

let audioElement: HTMLAudioElement | null = null;
let hasAttachedInteractionListener = false;

/**
 * 随机获取一首音乐（可排除当前正在播放的曲目）
 */
export function getRandomTrack(excludeId?: string): MusicTrack {
  const pool = excludeId && BGM_PLAYLIST.length > 1
    ? BGM_PLAYLIST.filter((t) => t.id !== excludeId)
    : BGM_PLAYLIST;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || BGM_PLAYLIST[0];
}

/**
 * 初始化全局背景音乐播放器
 */
export function initBgmPlayer() {
  if (typeof window === 'undefined' || audioElement) return;

  audioElement = new Audio();
  audioElement.volume = bgmVolume.value;
  audioElement.preload = 'auto';

  // 1. 初始随机选曲
  const initialTrack = getRandomTrack();
  currentBgmTrack.value = initialTrack;
  audioElement.src = initialTrack.file;

  // 2. 监听单曲播放完毕自动换下一首随机曲目
  audioElement.addEventListener('ended', () => {
    playNextBgmTrack();
  });

  // 3. 监听播放与暂停状态同步
  audioElement.addEventListener('play', () => {
    isBgmPlaying.value = true;
  });
  audioElement.addEventListener('pause', () => {
    isBgmPlaying.value = false;
  });
  audioElement.addEventListener('error', (e) => {
    console.warn('Audio playback error, trying next track...', e);
    setTimeout(() => {
      playNextBgmTrack();
    }, 1000);
  });

  isBgmInitialized.value = true;

  // 4. 尝试立即播放；若被浏览器策略拦截，则在用户首次交互时无缝启动
  attemptAutoPlay();
}

/**
 * 尝试自动播放；若被浏览器阻止，则注册一次性手势事件
 */
function attemptAutoPlay() {
  if (!audioElement) return;

  const playPromise = audioElement.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isBgmPlaying.value = true;
      })
      .catch(() => {
        // 浏览器阻止了未交互的自动播放，监听首次用户触摸/点击并启动
        if (!hasAttachedInteractionListener && typeof window !== 'undefined') {
          hasAttachedInteractionListener = true;
          const startOnUserGesture = () => {
            if (audioElement && audioElement.paused) {
              audioElement.play().then(() => {
                isBgmPlaying.value = true;
              }).catch(() => {});
            }
            window.removeEventListener('pointerdown', startOnUserGesture);
            window.removeEventListener('touchstart', startOnUserGesture);
            window.removeEventListener('click', startOnUserGesture);
          };

          window.addEventListener('pointerdown', startOnUserGesture, { once: true });
          window.addEventListener('touchstart', startOnUserGesture, { once: true });
          window.addEventListener('click', startOnUserGesture, { once: true });
        }
      });
  }
}

/**
 * 切换播放 / 暂停
 */
export function toggleBgmPlay() {
  if (!audioElement) {
    initBgmPlayer();
    return;
  }

  if (audioElement.paused) {
    audioElement.play().then(() => {
      isBgmPlaying.value = true;
    }).catch((err) => {
      console.warn('Failed to play audio:', err);
    });
  } else {
    audioElement.pause();
    isBgmPlaying.value = false;
  }
}

/**
 * 播放下一首随机曲目
 */
export function playNextBgmTrack() {
  if (!audioElement) {
    initBgmPlayer();
    return;
  }

  const nextTrack = getRandomTrack(currentBgmTrack.value?.id);
  currentBgmTrack.value = nextTrack;
  audioElement.src = nextTrack.file;
  audioElement.currentTime = 0;
  audioElement.play().then(() => {
    isBgmPlaying.value = true;
  }).catch((err) => {
    console.warn('Failed to play next track:', err);
  });
}

/**
 * 调节音量
 */
export function setBgmVolume(val: number) {
  const clamped = Math.max(0, Math.min(1, val));
  bgmVolume.value = clamped;
  if (audioElement) {
    audioElement.volume = clamped;
  }
}
