# Playwright 测试快速开始

## 🎯 一键运行测试

### 前提条件
1. ✅ 前端开发服务器正在运行 (`npm run dev`)
2. ✅ 后端服务正在运行（如需要）

### 步骤

#### 1️⃣ 首次使用 - 安装浏览器
```bash
npx playwright install
```

> 💡 如果网络问题导致下载失败，可以尝试多次运行或使用代理

#### 2️⃣ 运行所有测试
```bash
npm run test:e2e
```

#### 3️⃣ 查看测试报告
```bash
npm run test:e2e:report
```

---

## 🎨 推荐的调试方式

### UI 模式（最直观）
```bash
npm run test:e2e:ui
```

这会打开一个交互式界面，您可以：
- 👀 实时观看测试执行
- 🔍 探索页面元素
- ⏯️ 控制测试流程（播放/暂停/步进）
- 📸 查看截图和快照

### 调试模式
```bash
npm run test:e2e:debug
```

这会以调试模式运行，可以：
- 设置断点
- 检查变量
- 逐步执行

---

## 📝 测试文件位置

所有测试文件位于：`tests/e2e/`

当前已有：
- ✅ `login.spec.js` - 登录功能测试
- ✅ `navigation.spec.js` - 导航功能测试  
- ✅ `grade-entry.spec.js` - 成绩录入测试

---

## 🚀 编写新测试

1. 在 `tests/e2e/` 目录创建新文件，例如：`student-management.spec.js`

2. 复制以下模板：

```javascript
import { test, expect } from '@playwright/test';

test.describe('模块名称', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/');
    await page.fill('input[placeholder="请输入用户名"]', 'admin');
    await page.fill('input[placeholder="请输入密码"]', '123456');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(2000);
  });

  test('应该能够执行某个操作', async ({ page }) => {
    // 您的测试代码
  });
});
```

3. 运行测试：
```bash
npm run test:e2e
```

---

## 💡 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm run test:e2e` | 运行所有测试 |
| `npm run test:e2e:ui` | UI 模式运行（推荐） |
| `npm run test:e2e:debug` | 调试模式运行 |
| `npm run test:e2e:report` | 查看测试报告 |
| `npx playwright install` | 安装浏览器 |
| `npx playwright codegen http://localhost:5173` | 录制测试脚本 |

---

## 🎬 录制测试脚本（超方便！）

Playwright 可以自动录制您的操作并生成测试代码：

```bash
npx playwright codegen http://localhost:5173
```

这会：
1. 打开浏览器和控制台
2. 您在浏览器中的所有操作都会被记录
3. 自动生成测试代码
4. 复制代码到您的测试文件中

---

## ❓ 常见问题

### Q: 测试失败怎么办？
A: 
1. 运行 `npm run test:e2e:report` 查看详细报告
2. 查看截图和视频了解失败原因
3. 使用 UI 模式调试

### Q: 如何只运行某个测试文件？
A:
```bash
npx playwright test tests/e2e/login.spec.js
```

### Q: 如何只运行某个测试用例？
A:
在测试名称后添加 `.only`：
```javascript
test.only('这个测试会单独运行', async ({ page }) => { ... });
```

### Q: 测试超时怎么办？
A:
增加超时时间：
```javascript
test.setTimeout(60000); // 60秒
```

---

## 📚 更多信息

详细文档请查看：[PLAYWRIGHT_TESTING.md](./PLAYWRIGHT_TESTING.md)
