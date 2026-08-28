# 🌸 花笺记 · 3D 东方繁花与数字贺卡生成器

<div align="center">

![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Online-brightgreen?style=for-the-badge&logo=vercel)
![Nuxt 3](https://img.shields.io/badge/Nuxt-3.21-00DC82?style=flat-square&logo=nuxtdotjs)
![Three.js](https://img.shields.io/badge/Three.js-0.174-black?style=flat-square&logo=threedotjs)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vuedotjs)
![Zero Backend](https://img.shields.io/badge/Zero--Backend-LZ--String-blueviolet?style=flat-square)

### 🔗 在线体验地址 (Live Demo)
👉 **[https://send-flower.vercel.app/](https://send-flower.vercel.app/)** 👈

一个极简、古风美学、**纯前端零后端**的 3D 东方繁花与数字花笺生成及分享应用。挑选 93 款 3D 名花、定制唯美寄语、聆听 42 首随机古典音乐，所有数据通过算法高密度压缩在 URL 密符中，一键传递专属浪漫。

</div>

---

## ✨ 核心特性

- **💐 93 款真实 3D 鲜花与花艺库**：涵盖 7 大古风分类（繁花玉锦、绛雪红芳、素瓷幽香、碧水芙蓉、桃溪落樱、国色天香、蓬莱仙卉），支持 360° 展台旋转、重力微浮沉与全屏纯享赏花。
- **🎵 42 首随机古风背景音乐**：进站自动随机播放，单曲播完自动换下一首，并提供顶栏古典音乐浮窗与一键切歌。
- **🔒 零后端与隐私持久化**：使用 `lz-string` 算法将花卉选择、寄语、称呼与署名高密度压缩进 URL 查询参数（`?d=...`），无需数据库、不上传任何个人数据。
- **🎁 仪式感开箱（Unwrap Ritual）**：接收方打开专属链接时，呈现深邃星空中的发光朱砂印章；轻触印章即伴随仙音与星尘爆发，揭晓 3D 繁花与贺卡。
- **🔮 情绪智能配花 & 🎴 今日花签**：根据 6 大心境标签（相思、抚慰、喜庆、告白、向阳、好梦）自动推荐匹配花卉与古典题词；支持抽取每日幸运花签。
- **📱 手机陀螺仪重力感应**：在移动端倾斜手机时，3D 花束与浮游星尘粒子产生细腻的真实重力视差与光影跟随。
- **🖼️ 1080×1560 高清古风花笺挂轴导出**：内置离线 2D Canvas 合成器与动态二维码，一键生成带有扫码直达互动链接的专属高清数字花笺海报。

---

## 🛠️ 技术栈

- **核心框架**：[Nuxt 3](https://nuxt.com/) (Vue 3 Composition API + TypeScript)
- **3D 图形与物理渲染**：[Three.js](https://threejs.org/) + `GLTFLoader` + `OrbitControls`
- **样式与设计**：[Tailwind CSS](https://tailwindcss.com/) + 东方古风传统色系 + 毛玻璃拟态（Glassmorphism）
- **数据编解码**：[lz-string](https://github.com/pieroxy/lz-string) (URL-Safe Compression)
- **海报与二维码**：HTML5 Canvas 2D + [qrcode](https://github.com/soldair/node-qrcode)
- **声学与音效**：Browser Native Web Audio API + 42 首环境背景音乐

---

## 🚀 本地快速启动

### 1. 克隆与安装依赖

```bash
git clone https://github.com/Capter121/sendFlower.git
cd sendFlower
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始创作你的第一束 3D 古风花笺！

### 3. 静态构建与部署

```bash
pnpm generate
```
打包产物位于 `.output/public`，可直接部署至 Vercel、GitHub Pages、Cloudflare Pages 等静态托管平台。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
