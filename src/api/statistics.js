import request from './axios';

export default {
  // 获取系统概览统计数据
  getOverview() {
    return request.get('/statistics/overview');
  },
  
  // 获取学院分布统计
  getCollegeDistribution() {
    return request.get('/statistics/college');
  }
};
