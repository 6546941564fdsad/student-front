// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import * as Icons from '@ant-design/icons-vue'
import permission from './directives/permission'
import { initTheme } from './utils/theme'
import './assets/global-enhanced.css'

const app = createApp(App)
app.use(Antd)

// 注册权限指令
app.directive('permission', permission)

// 初始化主题系统
initTheme()

// 注册所有图标
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.mount('#app')