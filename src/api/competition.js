import request from './axios';
export const competitionApi = {
  getAll(page = 0, size = 10) { return request.get('/competitions', { params: { page, size } }); },
  getById(id) { return request.get(`/competitions/${id}`); },
  add(data) { return request.post('/competitions', data); },
  update(id, data) { return request.put(`/competitions/${id}`, data); },
  delete(id) { return request.delete(`/competitions/${id}`); },
  getStatistics() { return request.get('/competitions/statistics'); }
};
export default competitionApi;
