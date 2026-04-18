// src/utils/theme.js - 全局主题配置工具

import { ref } from 'vue';

// 主题状态（响应式）
export const themeMode = ref(localStorage.getItem('theme-mode') || 'light');

// 主题颜色配置
export const themes = {
  light: {
    // 主色调
    primaryColor: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',
    
    // 背景色
    bgColor: '#f0f2f5',
    cardBg: '#ffffff',
    headerBg: '#001529',
    siderBg: '#001529',
    
    // 文字颜色
    textColor: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // 边框颜色
    borderColor: '#e8e8e8',
    borderLight: '#f0f0f0',
    
    // 阴影
    shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    shadowHover: '0 4px 16px rgba(0, 0, 0, 0.12)',
    
    // 渐变
    gradientPrimary: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    gradientSuccess: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    gradientWarning: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
    gradientError: 'linear-gradient(135deg, #f5222d 0%, #cf1322 100%)',
  },
  
  dark: {
    // 主色调
    primaryColor: '#177ddc',
    primaryHover: '#4096ff',
    primaryActive: '#0958d9',
    
    // 背景色
    bgColor: '#141414',
    cardBg: '#1f1f1f',
    headerBg: '#001529',
    siderBg: '#001529',
    
    // 文字颜色
    textColor: '#e8e8e8',
    textSecondary: '#bfbfbf',
    textTertiary: '#8c8c8c',
    
    // 边框颜色
    borderColor: '#303030',
    borderLight: '#262626',
    
    // 阴影
    shadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
    shadowHover: '0 4px 16px rgba(0, 0, 0, 0.65)',
    
    // 渐变
    gradientPrimary: 'linear-gradient(135deg, #177ddc 0%, #0958d9 100%)',
    gradientSuccess: 'linear-gradient(135deg, #49aa19 0%, #389e0d 100%)',
    gradientWarning: 'linear-gradient(135deg, #d89614 0%, #ad6800 100%)',
    gradientError: 'linear-gradient(135deg, #a61d24 0%, #820014 100%)',
  }
};

/**
 * 切换主题模式
 */
export function toggleTheme() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme-mode', themeMode.value);
  applyTheme();
}

/**
 * 应用主题到 DOM
 */
export function applyTheme() {
  const theme = themes[themeMode.value];
  const root = document.documentElement;
  
  // 设置 CSS 变量
  Object.entries(theme).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`;
    root.style.setProperty(cssVar, value);
  });
  
  // 设置 body class
  if (themeMode.value === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

/**
 * 获取当前主题对象
 */
export function getCurrentTheme() {
  return themes[themeMode.value];
}

/**
 * 初始化主题
 */
export function initTheme() {
  applyTheme();
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-mode')) {
      themeMode.value = e.matches ? 'dark' : 'light';
      applyTheme();
    }
  });
}
