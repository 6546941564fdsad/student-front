// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import * as Icons from '@ant-design/icons-vue'
import permission from './directives/permission'

const app = createApp(App)
app.use(Antd)

// 注册权限指令
app.directive('permission', permission)

// 注册所有图标
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.mount('#app')