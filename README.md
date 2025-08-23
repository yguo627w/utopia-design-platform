# 我的乌托邦 - AI家装设计平台

## 🚀 项目简介

"我的乌托邦"是一个基于AI技术的智能家装设计平台，旨在让每个人都能轻松打造理想的家居空间。

## 🛠️ 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS 4 + Radix UI
- **AI服务**: 集成第三方AI图像生成API

## ⚠️ 重要配置

### 环境变量设置

在项目根目录创建 `.env.local` 文件，并添加以下配置：

```bash
# AI图像生成API配置
AI_IMAGE_GENERATION_API_KEY=your_api_key_here

# 其他环境变量
NODE_ENV=development
```

**注意**: 请将 `your_api_key_here` 替换为真实的API密钥。

## 🔧 最近修复的Bug

### 高优先级修复
1. ✅ **API密钥硬编码问题** - 使用环境变量存储敏感信息
2. ✅ **图像处理逻辑** - 改进blob URL和WebP格式处理
3. ✅ **购物车功能** - 修复价格解析和商品匹配问题

### 中优先级修复
4. ✅ **状态管理** - 完善sessionStorage清理逻辑
5. ✅ **错误处理** - 提供更详细的错误信息和解决建议
6. ✅ **文件验证** - 添加文件类型和大小验证

### 低优先级修复
7. ✅ **加载状态** - 改进用户操作反馈
8. ✅ **用户体验** - 添加toast通知和错误提示

## 🚀 快速开始

1. 安装依赖
```bash
npm install
# 或
pnpm install
```

2. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入真实的API密钥
```

3. 启动开发服务器
```bash
npm run dev
# 或
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
utopia-design-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── design/            # 设计工作台
│   ├── upload/            # 图片上传
│   ├── community/         # 灵感社区
│   ├── marketplace/       # 家具商城
│   └── profile/           # 个人中心
├── components/            # 可复用组件
├── lib/                   # 工具函数
└── public/                # 静态资源
```

## 🔒 安全说明

- API密钥已从代码中移除，使用环境变量管理
- 添加了文件类型和大小验证
- 改进了错误处理，避免敏感信息泄露

## 🐛 已知问题

- 某些TypeScript类型错误（不影响功能运行）
- 需要配置环境变量才能正常使用AI功能

## 📞 技术支持

如遇到问题，请检查：
1. 环境变量是否正确配置
2. API密钥是否有效
3. 网络连接是否正常

## 📄 许可证

本项目仅供学习和演示使用。
