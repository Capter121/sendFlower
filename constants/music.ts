export interface MusicTrack {
  id: string;
  file: string;
  title: string;
  artist?: string;
  tag?: string;
}

export const BGM_PLAYLIST: MusicTrack[] = [
  {
    id: 'et11lx-chinese-ancient-style-dizi-melody',
    file: '/music/et11lx-chinese-ancient-style-dizi-melody-etlx-solo-247346.mp3',
    title: '竹笛清韵 · 幽篁独奏',
    artist: 'ETLX',
    tag: '国风竹笛'
  },
  {
    id: 'et11lx-chinese-ancient-style-music-love',
    file: '/music/et11lx-chinese-ancient-style-music-love-etlx-247345.mp3',
    title: '云中锦书 · 脉脉情深',
    artist: 'ETLX',
    tag: '古风唯美'
  },
  {
    id: 'et11lx-ripple-chinese-ancient-style-music',
    file: '/music/et11lx-ripple-chinese-ancient-style-music-romantic-love-et11lx-155927.mp3',
    title: '水漾青莲 · 涟漪轻抚',
    artist: 'ETLX',
    tag: '古韵水韵'
  },
  {
    id: '43551419-moonnight',
    file: '/music/43551419-moonnight-274960.mp3',
    title: '月满西楼 · 幽夜清辉',
    artist: 'Moonnight',
    tag: '治愈清夜'
  },
  {
    id: 'grand_project-quiet-bloom_medium-1',
    file: '/music/grand_project-quiet-bloom_medium-1-soft-piano-403544.mp3',
    title: '静谧芳华 · 柔琴轻抚',
    artist: 'Grand Project',
    tag: '纯净钢琴'
  },
  {
    id: 'atlasaudio-calm-nature',
    file: '/music/atlasaudio-calm-nature-510279.mp3',
    title: '松间清泉 · 归林栖心',
    artist: 'Atlas Audio',
    tag: '自然白噪'
  },
  {
    id: 'desifreemusic-echoes-in-silence',
    file: '/music/desifreemusic-echoes-in-silence-a-tender-instrumental-for-poetry-and-memory-364020.mp3',
    title: '诗笺回响 · 岁痕如歌',
    artist: 'DesiFreeMusic',
    tag: '诗词伴奏'
  },
  {
    id: 'alexanderkopenkov-a-dream',
    file: '/music/alexanderkopenkov-a-dream-romantic-light-melody-performed-by-hq-synthesizer-157696.mp3',
    title: '浮生若梦 · 琉璃幻境',
    artist: 'Alexander Kopenkov',
    tag: '浪漫轻音'
  },
  {
    id: 'emmraan-magic-land',
    file: '/music/emmraan-magic-land-210409.mp3',
    title: '蓬莱幻野 · 仙音缥缈',
    artist: 'Emmraan',
    tag: '奇幻国风'
  },
  {
    id: 'tunetank-music-box-sleep-lullaby',
    file: '/music/tunetank-music-box-sleep-lullaby-349471.mp3',
    title: '八音流转 · 枕梦安眠',
    artist: 'Tunetank',
    tag: '八音盒催眠'
  }
];
