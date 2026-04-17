import request from './axios';

export default {
  // 分页查询学生列表
  getAll(page = 0, size = 10) {
    return request.get('/students', { params: { page, size } });
  },
  
  // 获取所有学生（不分页）
  getStudents() {
    return request.get('/students');
  },
  
  // 根据ID获取学生详情
  getStudent(id) {
    return request.get(`/students/${id}`);
  },
  
  // 创建学生
  createStudent(student) {
    return request.post('/students', student);
  },
  
  // 更新学生
  updateStudent(id, student) {
    return request.put(`/students/${id}`, student);
  },
  
  // 删除学生
  deleteStudent(id) {
    return request.delete(`/students/${id}`);
  }
};
