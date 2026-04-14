import request from './axios';
export const creditRecognitionApi = {
  getAll(page = 0, size = 10) { return request.get('/credit-recognitions', { params: { page, size } }); },
  getById(id) { return request.get(`/credit-recognitions/${id}`); },
  add(data) { return request.post('/credit-recognitions', data); },
  update(id, data) { return request.put(`/credit-recognitions/${id}`, data); },
  delete(id) { return request.delete(`/credit-recognitions/${id}`); },
  audit(id, data) { return request.put(`/credit-recognitions/${id}/audit`, data); },
  getStatistics() { return request.get('/credit-recognitions/statistics'); }
};
export default creditRecognitionApi;
