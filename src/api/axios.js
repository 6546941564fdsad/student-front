// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端服务地址，包含 context-path
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;