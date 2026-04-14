import request from './axios';
export const defenseApi = {
  getAll(page = 0, size = 10) { return request.get('/defenses', { params: { page, size } }); },
  getById(id) { return request.get(`/defenses/${id}`); },
  add(data) { return request.post('/defenses', data); },
  update(id, data) { return request.put(`/defenses/${id}`, data); },
  delete(id) { return request.delete(`/defenses/${id}`); }
};
export default defenseApi;
