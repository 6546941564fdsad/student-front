// src/utils/permission.js

/**
 * 角色权限配置
 * 定义每个角色可以访问的菜单项
 */
export const ROLE_PERMISSIONS = {
  // 超级管理员 - 拥有所有权限
  SUPER_ADMIN: [
    'data-stats', 'todo-list', 'system-notice',
    'student-archives', 'student-status', 'student-punishment', 'graduation-audit',
    'course-library', 'training-plan', 'teaching-plan', 'course-scheduling',
    'teacher-archives', 'teaching-task', 'teacher-evaluation',
    'grade-entry', 'grade-audit', 'grade-analysis', 'grade-export',
    'course-selection', 'attendance-management', 'exam-arrangement', 'internship-management',
    'competition-management', 'project-management', 'credit-recognition',
    'thesis-proposal', 'thesis-midterm', 'defense-management', 'thesis-grade',
    'user-management', 'role-permission', 'data-dictionary', 'system-log',
    'teaching-evaluation', 'academic-warning', 'course-change'
  ],
  
  // 管理员 - 拥有所有权限（兼容 ADMIN 角色）
  ADMIN: [
    'data-stats', 'todo-list', 'system-notice',
    'student-archives', 'student-status', 'student-punishment', 'graduation-audit',
    'course-library', 'training-plan', 'teaching-plan', 'course-scheduling',
    'teacher-archives', 'teaching-task', 'teacher-evaluation',
    'grade-management', 'grade-entry', 'grade-audit', 'grade-analysis', 'grade-export',
    'course-selection', 'attendance-management', 'exam-arrangement', 'internship-management',
    'competition-management', 'project-management', 'credit-recognition',
    'thesis-proposal', 'thesis-midterm', 'defense-management', 'thesis-grade',
    'user-management', 'role-permission', 'data-dictionary', 'system-log',
    'teaching-evaluation', 'academic-warning', 'course-change'
  ],
  
  // 教务管理员 - 教学管理相关权限
  ACADEMIC_ADMIN: [
    'data-stats', 'todo-list', 'system-notice',
    'student-archives', 'student-status', 'student-punishment', 'graduation-audit',
    'course-library', 'training-plan', 'teaching-plan', 'course-scheduling',
    'teacher-archives', 'teaching-task', 'teaching-evaluation',
    'grade-entry', 'grade-audit', 'grade-analysis', 'grade-export',
    'course-selection', 'attendance-management', 'exam-arrangement',
    'competition-management', 'project-management', 'credit-recognition',
    'thesis-proposal', 'thesis-midterm', 'defense-management', 'thesis-grade',
    'academic-warning', 'course-change'
  ],
  
  // 教师 - 只能查看和录入成绩
  TEACHER: [
    'data-stats',
    'student-archives',
    'teaching-task', 'teaching-evaluation',
    'grade-entry', 'grade-analysis',
    'attendance-management',
    'thesis-proposal', 'thesis-midterm', 'thesis-grade',
    'course-change'
  ],
  
  // 辅导员 - 学生管理相关
  COUNSELOR: [
    'data-stats', 'todo-list',
    'student-archives', 'student-status', 'student-punishment',
    'attendance-management',
    'competition-management', 'credit-recognition'
  ],
  
  // 学生 - 只能查看个人信息、选课、成绩查询等
  STUDENT: [
    'data-stats',
    'student-archives',  // 查看个人档案
    'course-selection',  // 选课
    'grade-analysis',    // 查看成绩
    'attendance-management',  // 查看考勤
    'exam-arrangement',  // 查看考试安排
    'internship-management',  // 实习申请
    'thesis-proposal',   // 毕业设计开题
    'teaching-evaluation'  // 教学评教
  ]
};

/**
 * 检查用户是否有权限访问某个菜单项
 * @param {string} userRole - 用户角色
 * @param {string} menuKey - 菜单项的 key
 * @returns {boolean} 是否有权限
 */
export function hasPermission(userRole, menuKey) {
  if (!userRole || !menuKey) {
    return false;
  }
  
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) {
    console.warn(`未找到角色 ${userRole} 的权限配置`);
    return false;
  }
  
  return permissions.includes(menuKey);
}

/**
 * 获取用户可访问的菜单项列表
 * @param {string} userRole - 用户角色
 * @returns {string[]} 可访问的菜单项 key 数组
 */
export function getUserPermissions(userRole) {
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * 过滤菜单树，只保留用户有权限的菜单项
 * @param {Array} menuTree - 原始菜单树
 * @param {string} userRole - 用户角色
 * @returns {Array} 过滤后的菜单树
 */
export function filterMenuByPermission(menuTree, userRole) {
  if (!menuTree || !Array.isArray(menuTree)) {
    return [];
  }
  
  return menuTree.filter(item => {
    // 检查当前菜单项是否有权限
    const hasAccess = hasPermission(userRole, item.key);
    
    // 如果有子菜单，递归过滤
    if (item.children && item.children.length > 0) {
      const filteredChildren = filterMenuByPermission(item.children, userRole);
      // 只有当有子菜单或自己有权限时才保留
      return filteredChildren.length > 0 || hasAccess;
    }
    
    return hasAccess;
  });
}

/**
 * 检查用户是否有任意一个权限
 * @param {string} userRole - 用户角色
 * @param {string[]} menuKeys - 菜单项 key 数组
 * @returns {boolean} 是否有任一权限
 */
export function hasAnyPermission(userRole, menuKeys) {
  if (!menuKeys || menuKeys.length === 0) {
    return false;
  }
  
  return menuKeys.some(key => hasPermission(userRole, key));
}

/**
 * 检查用户是否有所有权限
 * @param {string} userRole - 用户角色
 * @param {string[]} menuKeys - 菜单项 key 数组
 * @returns {boolean} 是否有所有权限
 */
export function hasAllPermissions(userRole, menuKeys) {
  if (!menuKeys || menuKeys.length === 0) {
    return false;
  }
  
  return menuKeys.every(key => hasPermission(userRole, key));
}
