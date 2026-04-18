import request from './axios';

export const attendanceApi = {
  // 获取考勤记录（支持分页和筛选）
  getAll(page = 0, size = 10, params = {}) {
    return request.get('/attendances', { 
      params: { 
        page, 
        size,
        ...params 
      } 
    });
  },
  
  // 根据ID获取考勤记录
  getById(id) {
    return request.get(`/attendances/${id}`);
  },
  
  // 添加考勤记录
  addAttendance(attendance) {
    return request.post('/attendances', attendance);
  },
  
  // 更新考勤记录
  updateAttendance(id, attendance) {
    return request.put(`/attendances/${id}`, attendance);
  },
  
  // 删除考勤记录
  deleteAttendance(id) {
    return request.delete(`/attendances/${id}`);
  },
  
  // 批量添加考勤
  batchAddAttendances(attendances) {
    return request.post('/attendances/batch', attendances);
  },
  
  // 获取考勤统计
  getStatistics(params) {
    return request.get('/attendances/statistics', { params });
  }
};

export default attendanceApi;
