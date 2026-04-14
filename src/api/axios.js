// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端服务地址，包含 context-path
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加 JWT Token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理 Token 过期
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token 过期或无效，清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 派发登出事件，通知 App.vue 更新状态（不刷新页面）
      window.dispatchEvent(new CustomEvent('token-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;