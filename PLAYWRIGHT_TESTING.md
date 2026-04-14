# Playwright E2E 测试指南

## 📋 概述

本项目使用 Playwright 进行端到端（E2E）自动化测试，确保前端功能的正确性和稳定性。

## 🚀 快速开始

### 1. 安装浏览器

首次使用前，需要安装 Playwright 所需的浏览器：

```bash
npx playwright install
```

如果网络问题导致下载失败，可以尝试：
- 使用代理
- 手动下载浏览器后放置到指定目录
- 使用国内镜像

### 2. 启动开发服务器

在运行测试之前，确保前端开发服务器正在运行：

```bash
npm run dev
```

默认地址：http://localhost:5173

### 3. 运行测试

#### 运行所有测试
```bash
npm run test:e2e
```

#### 以 UI 模式运行（推荐用于调试）
```bash
npm run test:e2e:ui
```

#### 以调试模式运行
```bash
npm run test:e2e:debug
```

#### 查看测试报告
```bash
npm run test:e2e:report
```

## 📁 测试文件结构

```
tests/
├── e2e/                    # E2E 测试用例
│   ├── login.spec.js      # 登录功能测试
│   ├── navigation.spec.js # 导航功能测试
│   └── grade-entry.spec.js # 成绩录入测试
└── fixtures/              # 测试夹具（可复用代码）
```

## 🧪 现有测试用例

### 1. 登录功能测试 (login.spec.js)
- ✅ 验证登录页面显示
- ✅ 使用正确凭据登录
- ✅ 使用错误凭据登录
- ✅ 空表单提交验证

### 2. 导航功能测试 (navigation.spec.js)
- ✅ 访问数据统计页面
- ✅ 访问学生档案页面
- ✅ 访问成绩录入页面
- ✅ 访问竞赛管理页面
- ✅ 访问开题管理页面
- ✅ 面包屑导航验证
- ✅ 退出登录功能

### 3. 成绩录入测试 (grade-entry.spec.js)
- ✅ 页面显示验证
- ✅ 新增成绩对话框
- ✅ 表单验证
- ✅ 数据筛选功能
- ✅ 分页功能

## 🔧 配置说明

配置文件：`playwright.config.js`

主要配置项：
- `baseURL`: http://localhost:5173
- `testDir`: ./tests
- `reporter`: HTML + List
- `screenshot`: 仅在失败时截图
- `video`: 仅在失败时保留视频
- `trace`: 首次重试时收集追踪信息

## 💡 编写新测试

### 基本模板

```javascript
import { test, expect } from '@playwright/test';

test.describe('功能模块名称', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前的准备工作
    await page.goto('/');
  });

  test('应该能够执行某个操作', async ({ page }) => {
    // 测试步骤
    await page.click('button:has-text("按钮文本")');
    
    // 断言验证
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### 常用 API

#### 页面操作
```javascript
await page.goto('/path');           // 导航到页面
await page.click('selector');       // 点击元素
await page.fill('selector', 'text'); // 填写输入框
await page.waitForTimeout(1000);    // 等待
```

#### 断言
```javascript
await expect(locator).toBeVisible();     // 元素可见
await expect(locator).toHaveText('text'); // 文本匹配
await expect(locator).toBeEnabled();     // 元素可用
```

#### 选择器
```javascript
page.locator('text=文本内容')           // 文本选择器
page.locator('.class-name')            // CSS 类选择器
page.locator('#id-name')               // ID 选择器
page.locator('button:has-text("登录")') // 组合选择器
```

## 🎯 最佳实践

### 1. 使用有意义的测试名称
```javascript
// ✅ 好
test('使用正确的凭据应该能够登录', async ({ page }) => { ... });

// ❌ 不好
test('test1', async ({ page }) => { ... });
```

### 2. 添加适当的等待
```javascript
// ✅ 使用智能等待
await page.waitForSelector('.element');

// ⚠️ 避免硬编码等待（除非必要）
await page.waitForTimeout(1000);
```

### 3. 保持测试独立性
每个测试应该能够独立运行，不依赖其他测试的状态。

### 4. 使用 beforeEach 减少重复代码
```javascript
test.beforeEach(async ({ page }) => {
  // 共同的准备工作
  await login(page);
});
```

## 🐛 调试技巧

### 1. 使用 UI 模式
```bash
npm run test:e2e:ui
```
UI 模式提供：
- 可视化测试执行
- 时间旅行调试
- 交互式选择器探索

### 2. 暂停执行
在测试中添加：
```javascript
await page.pause();
```

### 3. 查看追踪文件
测试失败后，运行：
```bash
npm run test:e2e:report
```

### 4. 截图和视频
失败的测试会自动保存截图和视频到 `test-results/` 目录。

## 📊 测试报告

HTML 报告会生成在 `playwright-report/` 目录，包含：
- 测试结果概览
- 每个测试的详细信息
- 截图和视频
- 追踪文件

## 🔄 CI/CD 集成

可以在 GitHub Actions 或其他 CI/CD 工具中集成：

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
```

## ⚠️ 注意事项

1. **确保后端服务运行**：某些测试需要后端 API 支持
2. **测试数据准备**：可能需要预先准备测试数据
3. **网络延迟**：适当增加等待时间以应对网络延迟
4. **浏览器兼容性**：目前仅配置了 Chromium，可根据需要添加 Firefox 和 WebKit

## 📚 参考资料

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright 测试最佳实践](https://playwright.dev/docs/best-practices)
- [Ant Design Vue 组件选择器](https://www.antdv.com/components/overview)

## 🤝 贡献

欢迎添加更多测试用例，覆盖更多功能模块！
