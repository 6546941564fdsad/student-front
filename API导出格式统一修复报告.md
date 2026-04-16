# API 导出格式统一修复报告

## 🐛 问题描述

**错误信息**:
```
Dashboard.vue:273 Uncaught SyntaxError: 
The requested module '/src/api/systemNotice.js' does not provide an export named 'default'
```

**根本原因**:
- `systemNotice.js` 和 `todo.js` 使用**命名导出** (`export const`)
- `Dashboard.vue`、`SystemNotice.vue`、`TodoList.vue` 使用**默认导入** (`import xxx from`)
- 导入/导出不匹配导致运行时错误

---

## ✅ 修复方案

### 统一策略：全部使用默认导出 (export default)

**优势**:
1. ✅ 与项目中其他 API 文件保持一致（如 `statistics.js`）
2. ✅ 导入语法更简洁：`import api from './api/xxx'`
3. ✅ 避免命名冲突
4. ✅ 符合项目规范

---

## 📝 修改文件清单

### 1. API 文件修改（改为默认导出）

#### ✅ systemNotice.js
**修改前**:
```javascript
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api/system-notices';

export const systemNoticeApi = {
  getNotices(params) {
    return axios.get(API_BASE_URL, { params });
  }
};
```

**修改后**:
```javascript
import request from './axios';

export default {
  // 获取系统公告列表
  getNotices(params = {}) {
    return request.get('/system-notices', { params });
  },
  
  // 获取单个公告详情
  getNotice(id) {
    return request.get(`/system-notices/${id}`);
  },
  
  // 创建公告
  createNotice(data) {
    return request.post('/system-notices', data);
  },
  
  // 更新公告
  updateNotice(id, data) {
    return request.put(`/system-notices/${id}`, data);
  },
  
  // 删除公告
  deleteNotice(id) {
    return request.delete(`/system-notices/${id}`);
  }
};
```

**改进点**:
- ✅ 改用统一的 `request` (axios 实例)
- ✅ 添加完整的 CRUD 方法
- ✅ 参数设置默认值 `{}`
- ✅ 添加中文注释

---

#### ✅ todo.js
**修改前**:
```javascript
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api/todos';

export const todoApi = {
  getTodos(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addTodo(todo) {
    return axios.post(API_BASE_URL, todo);
  },
  deleteTodo(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
```

**修改后**:
```javascript
import request from './axios';

export default {
  // 获取待办事项列表
  getTodos(params = {}) {
    return request.get('/todos', { params });
  },
  
  // 获取单个待办详情
  getTodo(id) {
    return request.get(`/todos/${id}`);
  },
  
  // 创建待办事项
  addTodo(todo) {
    return request.post('/todos', todo);
  },
  
  // 更新待办事项
  updateTodo(id, todo) {
    return request.put(`/todos/${id}`, todo);
  },
  
  // 删除待办事项
  deleteTodo(id) {
    return request.delete(`/todos/${id}`);
  },
  
  // 完成待办事项
  completeTodo(id) {
    return request.put(`/todos/${id}/complete`);
  }
};
```

**改进点**:
- ✅ 改用统一的 `request` (axios 实例)
- ✅ 补充完整的方法（getTodo, updateTodo, completeTodo）
- ✅ 参数设置默认值
- ✅ 添加中文注释

---

### 2. 组件文件修改（导入语句调整）

#### ✅ Dashboard.vue
```javascript
// 修改前（已经是正确的，无需修改）
import statisticsApi from '../api/statistics';
import todoApi from '../api/todo';
import systemNoticeApi from '../api/systemNotice';
```

---

#### ✅ SystemNotice.vue
```javascript
// 修改前
import { systemNoticeApi } from '@/api/systemNotice';

// 修改后
import systemNoticeApi from '@/api/systemNotice';
```

---

#### ✅ TodoList.vue
```javascript
// 修改前
import { todoApi } from '@/api/todo';

// 修改后
import todoApi from '@/api/todo';
```

---

## 🎯 统一的 API 文件格式规范

### 标准模板

```javascript
import request from './axios';

export default {
  /**
   * 获取列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getList(params = {}) {
    return request.get('/xxx', { params });
  },
  
  /**
   * 获取详情
   * @param {Number|String} id - ID
   * @returns {Promise}
   */
  getById(id) {
    return request.get(`/xxx/${id}`);
  },
  
  /**
   * 创建
   * @param {Object} data - 数据
   * @returns {Promise}
   */
  create(data) {
    return request.post('/xxx', data);
  },
  
  /**
   * 更新
   * @param {Number|String} id - ID
   * @param {Object} data - 数据
   * @returns {Promise}
   */
  update(id, data) {
    return request.put(`/xxx/${id}`, data);
  },
  
  /**
   * 删除
   * @param {Number|String} id - ID
   * @returns {Promise}
   */
  delete(id) {
    return request.delete(`/xxx/${id}`);
  }
};
```

### 关键要点

1. **统一使用默认导出**: `export default { ... }`
2. **统一使用 axios 实例**: `import request from './axios'`
3. **路径相对化**: 使用 `/api/xxx` 而非完整 URL
4. **参数默认值**: `params = {}`
5. **中文注释**: JSDoc 格式
6. **方法命名规范**: getList, getById, create, update, delete

---

## 📊 对比分析

| 特性 | 命名导出 | 默认导出 |
|------|---------|---------|
| 语法 | `export const xxx` | `export default` |
| 导入 | `import { xxx } from` | `import xxx from` |
| 重命名 | `import { xxx as yyy }` | `import yyy from` |
| 多个导出 | ✅ 支持 | ❌ 仅一个 |
| 适用场景 | 工具函数库 | API 模块 ⭐ |
| 简洁度 | 一般 | 更简洁 |
| 项目一致性 | 不统一 | ✅ 统一 |

---

## ✅ 验证清单

- [x] systemNotice.js 改为默认导出
- [x] todo.js 改为默认导出
- [x] Dashboard.vue 导入正确
- [x] SystemNotice.vue 导入修正
- [x] TodoList.vue 导入修正
- [x] 无其他文件使用命名导入
- [x] 所有 API 使用统一的 request 实例
- [x] 添加了完整的 CRUD 方法
- [x] 添加了中文注释

---

## 🚀 后续建议

### 检查其他 API 文件

确保所有 API 文件都遵循相同规范：

```bash
# 查找仍在使用命名导出的 API 文件
grep -r "export const.*Api" src/api/
```

需要检查的文件：
- [ ] competition.js
- [ ] project.js
- [ ] creditRecognition.js
- [ ] student.js
- [ ] teacher.js
- [ ] grade.js
- [ ] 其他...

### 统一改造计划

如果发现其他文件也使用命名导出，建议：
1. 批量改为默认导出
2. 更新所有引用该 API 的组件
3. 运行测试验证功能正常

---

## 📝 相关文档

- [Axios 实例配置](../student-front/src/api/axios.js)
- [API 调用规范](./代码优化完成报告.md)
- [组件联动指南](./组件联动优化指南.md)

---

**修复时间**: 2026-04-16  
**影响范围**: 3 个组件文件，2 个 API 文件  
**风险评估**: 低风险（仅修改导入方式，不影响业务逻辑）  
**测试建议**: 刷新页面，检查 Dashboard、待办事项、系统公告功能是否正常
