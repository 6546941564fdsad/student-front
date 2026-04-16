import request from './axios';

export default {
  // 获取系统公告列表
  getNotices(params = {}) {
    return request.get('/system-notices', { params });
  },
  
  // 获取单个公告详情
  getNotice(id) {
    return request.get(`/system-notices/${id}`);
  },
  
  // 创建公告
  createNotice(data) {
    return request.post('/system-notices', data);
  },
  
  // 更新公告
  updateNotice(id, data) {
    return request.put(`/system-notices/${id}`, data);
  },
  
  // 删除公告
  deleteNotice(id) {
    return request.delete(`/system-notices/${id}`);
  }
};
