import request from './axios';

export const courseSelectionApi = {
  // 获取可选课程列表
  getAvailableCourses(params) {
    return request.get('/courses', { params });
  },
  
  // 获取已选课程列表
  getSelectedCourses(params) {
    return request.get('/course-selections', { params });
  },
  
  // 选课
  selectCourse(data) {
    return request.post('/course-selections', data);
  },
  
  // 退课
  dropCourse(id) {
    return request.delete(`/course-selections/${id}`);
  },
  
  // 获取所有选课记录（管理端用）
  getSelections(params) {
    return request.get('/course-selections', { params });
  },
  
  // 添加选课记录（管理端用）
  addSelection(selection) {
    return request.post('/course-selections', selection);
  },
  
  // 删除选课记录（管理端用）
  deleteSelection(id) {
    return request.delete(`/course-selections/${id}`);
  }
};

export default courseSelectionApi;
