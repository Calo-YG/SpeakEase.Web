# SpeakEase - 语言学习平台

SpeakEase是一个现代化的语言学习Web应用，基于Vue 3、TypeScript和Vite构建，旨在为用户提供全面的语言学习体验。

## 项目特点

- **全面的学习模块**：包括听力、口语、阅读、词汇等多个学习维度
- **个性化学习体验**：根据用户学习进度和偏好提供定制化的学习内容
- **进度追踪系统**：直观展示学习进度，帮助用户了解自己的学习情况
- **现代化UI设计**：使用Element Plus和Ant Design Vue组件库，提供美观且易用的界面
- **响应式设计**：适配不同设备屏幕尺寸，提供一致的用户体验

## 功能模块

### 用户系统
- 用户注册与登录
- 个人资料管理
- 学习设置与偏好

### 学习模块
- **词汇学习**：单词记忆、复习与测试
- **听力训练**：音频理解与练习
- **口语练习**：发音训练与对话模拟
- **阅读理解**：文章阅读与理解练习
- **每日练习**：定制化的日常学习任务

### 进度追踪
- 学习数据可视化
- 学习日历与打卡记录
- 能力水平评估

## 技术栈

- **前端框架**：Vue 3
- **开发语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **UI组件库**：Element Plus、Ant Design Vue
- **HTTP请求**：Axios
- **数据可视化**：Chart.js、Vue-ChartJS
- **日期处理**：Day.js、Date-fns
- **表格导出**：XLSX

## 开发指南

### 环境要求
- Node.js 16.x 或更高版本
- pnpm 7.x 或更高版本

### 安装依赖
```bash
pnpm install
```

### 开发环境运行
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 代码规范
项目使用ESLint和Prettier进行代码规范检查和格式化：
```bash
# ESLint检查
pnpm eslint

# Prettier格式化
pnpm prettier
```

### 提交规范
项目使用commitizen规范化Git提交信息：
```bash
pnpm commit
```

## 项目结构
```
src/
├── api/          # API接口定义
├── assets/       # 静态资源
├── components/   # 公共组件
├── http/         # HTTP请求配置
├── router/       # 路由配置
├── store/        # Pinia状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── views/        # 页面组件
    ├── dashboard/    # 学习概览
    ├── listening/    # 听力训练
    ├── login/        # 登录页面
    ├── practice/     # 每日练习
    ├── profile/      # 个人中心
    ├── progress/     # 学习进度
    ├── reading/      # 阅读理解
    ├── register/     # 注册页面
    ├── settings/     # 系统设置
    ├── speaking/     # 口语练习
    └── vocabulary/   # 词汇学习
```

## 许可证

[MIT](LICENSE)
