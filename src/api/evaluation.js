// src/api/evaluation.js
import api from './axios';

export const evaluationApi = {
  // 获取所有评教记录
  getAll: () => api.get('/evaluations'),
  
  // 根据ID获取评教记录
  getById: (id) => api.get(`/evaluations/${id}`),
  
  // 根据评教类型查询
  getByEvalType: (evalType) => api.get(`/evaluations/type/${evalType}`),
  
  // 根据教师ID查询
  getByTeacherId: (teacherId) => api.get(`/evaluations/teacher/${teacherId}`),
  
  // 根据学期查询
  getBySemester: (semester) => api.get(`/evaluations/semester/${semester}`),
  
  // 根据教师ID和学期查询
  getByTeacherAndSemester: (teacherId, semester) => 
    api.get(`/evaluations/teacher/${teacherId}/semester/${semester}`),
  
  // 获取教师评教统计
  getTeacherStatistics: (teacherId) => 
    api.get(`/evaluations/statistics/teacher/${teacherId}`),
  
  // 添加评教记录
  add: (evaluation) => api.post('/evaluations', evaluation),
  
  // 更新评教记录
  update: (id, evaluation) => api.put(`/evaluations/${id}`, evaluation),
  
  // 删除评教记录
  delete: (id) => api.delete(`/evaluations/${id}`)
};
