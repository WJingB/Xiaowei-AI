# 午托伴侣 · 老师端 MVP

面向午托班/教培机构老师的移动端 H5 家校沟通工具。老师上传照片后，系统调用大模型生成文案，并合成精美分享卡片。

## 功能特性

- **手拍播报**：老师拍照上传，AI 生成文案与分享卡片
- **无感监控播报（NEW）**：模拟现有摄像头定时截帧 + 豆包多模态解析
- **机构信息（选填）**：机构名称、Logo，不填则卡片不显示机构区域
- **餐次选择**：午饭 / 晚饭 / 点心零食 / 早餐 / 水果
- **多图上传**：支持一次选择多张图片
- **卡片模式**：合并为一张卡片，或每张图单独生成卡片
- **卡片主题**：5 种外观（暖阳橙、清新绿、典雅紫、经典蓝、活力粉）
- **精美排版**：图片左右留白，圆角阴影，更美观

## 技术栈

- Next.js 15 (App Router) + React 19
- Tailwind CSS 4
- shadcn/ui 风格基础组件
- html-to-image（卡片导出）

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)，PC 端会以 `max-w-md` 居中模拟手机屏幕。

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页：机构信息 + 上传入口
│   ├── monitor/page.tsx      # 无感监控播报（MVP：上传截帧模拟）
│   ├── preview/page.tsx      # 预览与文案生成
│   ├── share/page.tsx        # 卡片生成与分享
│   └── api/analyze/route.ts  # 豆包 API 代理
├── components/
│   ├── home/                 # 机构设置、餐次选择、图片选择
│   ├── preview/              # 预览、布局模式选择
│   ├── share/                # 分享卡片、主题选择
│   ├── layout/               # 布局组件
│   └── ui/                   # 基础 UI 组件
├── context/
│   └── app-context.tsx       # 跨页面状态管理
├── lib/
│   ├── doubao-server.ts      # 豆包服务端调用
│   ├── monitor-prompt.ts     # 监控专用 Prompt（质检+文案）
│   ├── monitor-config.ts     # 作息定时与监控时段配置
│   ├── card-themes.ts        # 卡片主题配置
│   └── institution-storage.ts # 机构信息本地持久化
├── utils/
│   └── api.ts                # 客户端 API 封装
└── types/
    └── index.ts              # 类型定义
```

## 环境变量配置

1. 复制示例文件：

```bash
cp .env.example .env.local
```

2. 在 `.env.local` 中填入火山方舟 API Key（**不要提交到 Git**）：

```env
ARK_API_KEY=你的_API_Key
ARK_MODEL=doubao-seed-2-0-mini-260428
ARK_API_URL=https://ark.cn-beijing.volces.com/api/v3/responses
```

## 无感监控模块（MVP）

当前为演示闭环，真实 RTSP/云端流接入预留：

| 时段 | 摄像头 | 时间 |
|------|--------|------|
| 午餐就餐 | 餐厅 | 12:00-12:30 |
| 午休监护 | 午休室 | 13:00-14:00 |
| 作业辅导 | 教室 | 16:00-18:00 |

**MVP 流程**：首页 → 无感监控播报 → 选择时段 → 上传 1-3 张监控截帧 → 可选隐私模糊 → 模拟抓拍 → AI 质检+文案 → 生成卡片

**正式版扩展**：`src/lib/monitor-capture.ts`（待实现）对接 RTSP / 海康·大华·萤石云 API

## 核心流程

1. **首页** → 填写机构信息（选填）→ 选择场景 → 食安类需选餐次 → 拍照/多选图片
2. **预览页** → 选择卡片模式与主题 → AI 生成 3 种语气文案 → 编辑 → 生成分享卡片
3. **分享页** → 预览海报 → 切换主题 → 保存单张/全部 → 复制文案并返回
