// src/api/courseChange.js
import api from './axios';

export const courseChangeApi = {
  // 获取所有变更记录
  getAll: () => api.get('/course-changes'),
  
  // 根据ID获取变更记录
  getById: (id) => api.get(`/course-changes/${id}`),
  
  // 根据教师ID查询
  getByTeacherId: (teacherId) => api.get(`/course-changes/teacher/${teacherId}`),
  
  // 根据变更类型查询
  getByChangeType: (changeType) => api.get(`/course-changes/type/${changeType}`),
  
  // 根据状态查询
  getByStatus: (status) => api.get(`/course-changes/status/${status}`),
  
  // 获取待审批记录
  getPending: () => api.get('/course-changes/pending'),
  
  // 根据学期查询
  getBySemester: (semester) => api.get(`/course-changes/semester/${semester}`),
  
  // 获取状态统计
  countByStatus: () => api.get('/course-changes/statistics/status'),
  
  // 获取类型统计
  countByChangeType: () => api.get('/course-changes/statistics/type'),
  
  // 添加变更记录
  add: (change) => api.post('/course-changes', change),
  
  // 更新变更记录
  update: (id, change) => api.put(`/course-changes/${id}`, change),
  
  // 删除变更记录
  delete: (id) => api.delete(`/course-changes/${id}`)
};
