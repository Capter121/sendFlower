# 🌸 Digital Bloom · 3D 虚拟花束与数字贺卡生成器

<div align="center">

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.21-00DC82?style=flat-square&logo=nuxtdotjs)
![Three.js](https://img.shields.io/badge/Three.js-0.174-black?style=flat-square&logo=threedotjs)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vuedotjs)
![Zero Backend](https://img.shields.io/badge/Zero--Backend-LZ--String-blueviolet?style=flat-square)

一个极简、优雅、**纯前端零后端**的 3D 真实繁花与数字贺卡生成及分享应用。用户可挑选或随机抽取 3D 鲜花并附上真挚寄语，所有数据通过算法高密度压缩在 URL 中，一键传递专属仪式感。

</div>

---

## ✨ 核心特性

- **💐 93 款真实 3D 鲜花与花艺库**：涵盖 7 大分类（手捧花束、浪漫玫瑰、瓷瓶插花、睡莲百合、樱花木兰、牡丹名花、奇幻生机），支持 360° 展台旋转与微浮沉。
- **🔒 零后端与隐私持久化**：使用 `lz-string` 算法将花卉选择、寄语、称呼与署名高密度压缩进 URL 查询参数（`?d=...`），无需数据库、不上传任何个人数据。
- **🎁 仪式感开箱（Unwrap Ritual）**：接收方打开专属链接时，呈现深邃星空中的发光火漆印章；轻触印章即伴随仙音与星尘爆发，揭晓 3D 繁花与贺卡。
- **🎵 纯原生 Web Audio 空间声学合成**：0KB 音频文件加载，纯算法实时合成空灵水晶风铃、花开共鸣音效与操作气泡音。
- **🔮 情绪智能配花 & 🎴 今日花签**：根据 6 大心境标签（想念、辛苦、庆祝、告白、鼓励、晚安）自动推荐匹配花卉与唯美文案；支持抽取每日幸运花签。
- **📱 手机陀螺仪重力感应**：在移动端倾斜手机时，3D 花束与浮游星尘粒子产生细腻的真实重力视差与光影跟随。
- **🖼️ 1080×1560 高清贺卡海报导出**：内置离线 2D Canvas 合成器与动态二维码，一键生成带有扫码直达互动链接的专属高清数字贺卡海报。

---

## 🛠️ 技术栈

- **核心框架**：[Nuxt 3](https://nuxt.com/) (Vue 3 Composition API + TypeScript)
- **3D 图形与后处理**：[Three.js](https://threejs.org/) + `GLTFLoader` + `UnrealBloomPass` + `OrbitControls`
- **样式与设计**：[Tailwind CSS](https://tailwindcss.com/) + 莫兰迪暗夜色系 + 毛玻璃拟态（Glassmorphism）
- **数据编解码**：[lz-string](https://github.com/pieroxy/lz-string) (URL-Safe Compression)
- **海报与二维码**：HTML5 Canvas 2D + [qrcode](https://github.com/soldair/node-qrcode)
- **声学合成**：Browser Native Web Audio API

---

## 🚀 本地快速启动

### 1. 克隆与安装依赖

```bash
git clone https://github.com/<your-username>/sendFlower.git
cd sendFlower
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始创作你的第一束 3D 数字花束！

### 3. 静态构建与部署

由于采用纯前端零后端架构，本项目可直接构建为静态网页并免费部署至 **GitHub Pages**、**Vercel**、**Cloudflare Pages** 或 **Netlify**：

```bash
pnpm generate
```
打包产物位于 `.output/public`，可直接上传托管。

---

## 📂 项目目录结构

```text
sendFlower/
├── assets/
│   └── css/main.css           # 全局样式、毛玻璃与暗夜色调
├── components/
│   ├── AppHeader.vue          # 极简顶部栏与静音开关
│   ├── CardPreviewModal.vue   # 1080P 高清贺卡海报预览与下载弹窗
│   ├── FlowerModel3D.vue      # 核心 3D GLB 模型渲染器 (光照/星尘/陀螺仪)
│   ├── MessageEditor.vue      # 寄语定制、称呼署名与推荐语
│   ├── ModelSelector.vue      # 93 款花卉分类选择器与随机抽花
│   ├── MoodMatcherModal.vue   # 情绪智能配花与每日花签
│   ├── ShareModal.vue         # 专属链接生成与海报下载弹窗
│   ├── Toast.vue              # 复制提示浮层
│   └── UnwrapRitual.vue       # 火漆印章开箱仪式感交互组件
├── constants/
│   └── models.ts              # 93 款 3D 模型元数据、花语与调色配置
├── pages/
│   ├── index.vue              # 发送端首页（选花、定制留言、生成链接）
│   └── receive.vue            # 接收端展示页（开箱仪式、全屏3D、渐显贺卡）
├── public/
│   └── models/                # 93 款 3D GLB 花卉模型静态资产
├── utils/
│   ├── audioSynth.ts          # Web Audio API 纯原生音效合成器
│   ├── cardCodec.ts           # LZ-String URL 状态压缩与解压引擎
│   └── cardPosterGenerator.ts # Canvas 高清贺卡海报与二维码生成器
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
