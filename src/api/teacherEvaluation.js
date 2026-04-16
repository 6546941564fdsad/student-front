import request from './axios';

/**
 * 教师评价 API
 */
export const teacherEvaluationApi = {
  // 获取所有评价（分页）
  getAll(page = 0, size = 10) {
    return request.get('/teacher-evaluations', {
      params: { page, size }
    });
  },

  // 添加评价
  add(evaluation) {
    return request.post('/teacher-evaluations', evaluation);
  },

  // 根据ID获取评价
  getById(id) {
    return request.get(`/teacher-evaluations/${id}`);
  },

  // 更新评价
  update(id, evaluation) {
    return request.put(`/teacher-evaluations/${id}`, evaluation);
  },

  // 删除评价
  delete(id) {
    return request.delete(`/teacher-evaluations/${id}`);
  },

  // 根据教师ID查询
  getByTeacherId(teacherId, page = 0, size = 10) {
    return request.get(`/teacher-evaluations/teacher/${teacherId}`, {
      params: { page, size }
    });
  },

  // 根据评价类型查询
  getByType(evalType, page = 0, size = 10) {
    return request.get(`/teacher-evaluations/type/${evalType}`, {
      params: { page, size }
    });
  },

  // 根据学期查询
  getBySemester(semester, page = 0, size = 10) {
    return request.get(`/teacher-evaluations/semester/${semester}`, {
      params: { page, size }
    });
  },

  // 获取统计数据
  getStatistics() {
    return request.get('/teacher-evaluations/statistics');
  }
};
