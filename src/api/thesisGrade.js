import request from './axios';
export const thesisGradeApi = {
  getAll(page = 0, size = 10) { return request.get('/thesis-grades', { params: { page, size } }); },
  getById(id) { return request.get(`/thesis-grades/${id}`); },
  add(data) { return request.post('/thesis-grades', data); },
  update(id, data) { return request.put(`/thesis-grades/${id}`, data); },
  delete(id) { return request.delete(`/thesis-grades/${id}`); }
};
export default thesisGradeApi;
