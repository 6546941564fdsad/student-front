import request from './axios';
export const projectApi = {
  getAll(page = 0, size = 10) { return request.get('/projects', { params: { page, size } }); },
  getById(id) { return request.get(`/projects/${id}`); },
  add(data) { return request.post('/projects', data); },
  update(id, data) { return request.put(`/projects/${id}`, data); },
  delete(id) { return request.delete(`/projects/${id}`); },
  getStatistics() { return request.get('/projects/statistics'); }
};
export default projectApi;
