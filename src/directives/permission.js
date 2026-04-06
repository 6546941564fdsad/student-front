// src/directives/permission.js

import { hasPermission } from '../utils/permission';

/**
 * 自定义指令 v-permission
 * 用法: <a-button v-permission="'student-archives'">按钮</a-button>
 */
export default {
  mounted(el, binding) {
    const { value } = binding;
    
    if (value) {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        el.style.display = 'none';
        return;
      }
      
      const user = JSON.parse(userStr);
      const userRole = user.role || user.userRole;
      
      if (!hasPermission(userRole, value)) {
        el.style.display = 'none';
      }
    }
  },
  updated(el, binding) {
    const { value } = binding;
    
    if (value) {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        el.style.display = 'none';
        return;
      }
      
      const user = JSON.parse(userStr);
      const userRole = user.role || user.userRole;
      
      if (!hasPermission(userRole, value)) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    }
  }
};
