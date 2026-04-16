import request from './axios';

export default {
  // 获取教师列表（分页）
  getTeachers(params) {
    return request.get('/teachers', { params });
  },
  
  // 获取教师详情
  getTeacherById(id) {
    return request.get(`/teachers/${id}`);
  },
  
  // 新增教师
  addTeacher(data) {
    return request.post('/teachers', data);
  },
  
  // 更新教师
  updateTeacher(id, data) {
    return request.put(`/teachers/${id}`, data);
  },
  
  // 删除教师
  deleteTeacher(id) {
    return request.delete(`/teachers/${id}`);
  }
};
