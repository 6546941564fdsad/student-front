import request from './axios';

/**
 * 成绩管理 API
 */
export const gradeApi = {
  // 分页查询所有成绩
  getAll(page = 0, size = 10) {
    return request.get('/grades', { params: { page, size } });
  },

  // 根据ID查询成绩
  getById(id) {
    return request.get(`/grades/${id}`);
  },

  // 创建成绩
  add(grade) {
    return request.post('/grades', grade);
  },

  // 批量创建成绩
  batchAdd(grades) {
    return request.post('/grades/batch', grades);
  },

  // 更新成绩
  update(id, grade) {
    return request.put(`/grades/${id}`, grade);
  },

  // 删除成绩
  delete(id) {
    return request.delete(`/grades/${id}`);
  },

  // 按学号查询
  getByStudentNo(studentNo) {
    return request.get(`/grades/student/${studentNo}`);
  },

  // 按课程ID查询
  getByCourseId(courseId) {
    return request.get(`/grades/course/${courseId}`);
  },

  // 按学期分页查询
  getBySemester(semester, page = 0, size = 10) {
    return request.get(`/grades/semester/${semester}`, { params: { page, size } });
  },

  // 按状态分页查询
  getByStatus(status, page = 0, size = 10) {
    return request.get(`/grades/status/${status}`, { params: { page, size } });
  },

  // 审核成绩
  audit(id, data) {
    return request.put(`/grades/${id}/audit`, data);
  },

  // 批量审核成绩
  batchAudit(data) {
    return request.post('/grades/batch-audit', data);
  },

  // 获取统计数据
  getStatistics() {
    return request.get('/grades/statistics');
  }
};

export default gradeApi;
