// src/api/warning.js
import api from './axios';

export const warningApi = {
  // 获取所有预警记录
  getAll: () => api.get('/warnings'),
  
  // 根据ID获取预警记录
  getById: (id) => api.get(`/warnings/${id}`),
  
  // 根据学生ID查询
  getByStudentId: (studentId) => api.get(`/warnings/student/${studentId}`),
  
  // 根据预警类型查询
  getByWarningType: (warningType) => api.get(`/warnings/type/${warningType}`),
  
  // 根据预警等级查询
  getByWarningLevel: (warningLevel) => api.get(`/warnings/level/${warningLevel}`),
  
  // 根据状态查询
  getByStatus: (status) => api.get(`/warnings/status/${status}`),
  
  // 根据学期查询
  getBySemester: (semester) => api.get(`/warnings/semester/${semester}`),
  
  // 获取预警等级统计
  countByWarningLevel: () => api.get('/warnings/statistics/level'),
  
  // 获取预警类型统计
  countByWarningType: () => api.get('/warnings/statistics/type'),
  
  // 添加预警记录
  add: (warning) => api.post('/warnings', warning),
  
  // 更新预警记录
  update: (id, warning) => api.put(`/warnings/${id}`, warning),
  
  // 删除预警记录
  delete: (id) => api.delete(`/warnings/${id}`)
};
