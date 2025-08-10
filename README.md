# METATOPIA Gaming Platform

🎮 **METATOPIA (MTP)** - AI-Powered GameFi Platform

一个现代化的Web3游戏平台，集成了加密货币钱包功能，使用React、TypeScript和Tailwind CSS构建。

## ✨ 功能特性

- 🎯 **游戏中心** - 浏览和体验各种游戏
- 🏆 **电竞赛事** - 参与电竞比赛和锦标赛
- 💰 **加密钱包** - 内置钱包管理和交易功能
- 🎓 **游戏学院** - 学习游戏技能和策略
- 👥 **社交功能** - 与其他玩家互动交流
- 🖼️ **NFT市场** - 交易游戏内NFT资产
- 👤 **用户系统** - 完整的注册、登录和个人资料管理
- 🎨 **现代UI** - 响应式设计，支持深色主题

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + 自定义CSS
- **路由**: React Router DOM
- **状态管理**: Zustand
- **动画**: Framer Motion
- **数据获取**: TanStack React Query
- **通知**: Sonner
- **图标**: Lucide React
- **代码规范**: ESLint + TypeScript ESLint

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### TypeScript类型检查

```bash
npm run check
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
├── contexts/           # React Context
├── hooks/              # 自定义Hooks
├── lib/                # 工具库
├── pages/              # 页面组件
├── services/           # API服务
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🎮 主要功能模块

### 认证系统
- 用户注册和登录
- JWT令牌管理
- 受保护的路由
- 密码强度验证

### 钱包功能
- 多币种支持 (BTC, ETH, USDT等)
- 余额查看
- 充值和提现
- 交易历史
- 安全验证

### 游戏中心
- 游戏浏览和搜索
- 游戏详情页面
- 分类筛选
- 热门推荐

### 用户界面
- 响应式设计
- 深色主题
- 流畅动画
- 现代化UI组件

## 🔧 配置说明

### 环境变量

项目使用本地存储和模拟API，无需额外的环境变量配置。

### 部署

项目已配置Vercel部署，包含`vercel.json`配置文件。

## 📝 开发说明

### 代码规范
- 使用TypeScript进行类型安全
- 遵循ESLint规则
- 组件使用函数式组件和Hooks
- 样式使用Tailwind CSS类名

### 状态管理
- 认证状态使用React Context
- 钱包状态使用Zustand
- 服务器状态使用React Query

### 路由结构
- 公开路由：首页、游戏中心、学院
- 认证路由：登录、注册（已登录用户重定向）
- 受保护路由：个人资料、钱包、电竞等

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [在线演示](https://metatopia-gaming-platform.vercel.app)
- [项目文档](./docs)
- [问题反馈](https://github.com/jiamingwang2/metatopia-gaming-platform/issues)

---

**METATOPIA** - 打造下一代游戏体验 🚀