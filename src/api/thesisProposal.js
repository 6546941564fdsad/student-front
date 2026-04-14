import request from './axios';
export const thesisProposalApi = {
  getAll(page = 0, size = 10) { return request.get('/thesis-proposals', { params: { page, size } }); },
  getById(id) { return request.get(`/thesis-proposals/${id}`); },
  add(data) { return request.post('/thesis-proposals', data); },
  update(id, data) { return request.put(`/thesis-proposals/${id}`, data); },
  delete(id) { return request.delete(`/thesis-proposals/${id}`); }
};
export default thesisProposalApi;
