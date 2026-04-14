import request from './axios';
export const thesisMidtermApi = {
  getAll(page = 0, size = 10) { return request.get('/thesis-midterms', { params: { page, size } }); },
  getById(id) { return request.get(`/thesis-midterms/${id}`); },
  add(data) { return request.post('/thesis-midterms', data); },
  update(id, data) { return request.put(`/thesis-midterms/${id}`, data); },
  delete(id) { return request.delete(`/thesis-midterms/${id}`); }
};
export default thesisMidtermApi;
