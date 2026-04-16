import request from './axios';

export const internshipApi = {
  getAll(page = 0, size = 10) {
    return request.get('/internships', { params: { page, size } });
  },

  add(internship) {
    return request.post('/internships', internship);
  },

  getById(id) {
    return request.get(`/internships/${id}`);
  },

  update(id, internship) {
    return request.put(`/internships/${id}`, internship);
  },

  delete(id) {
    return request.delete(`/internships/${id}`);
  },

  approve(id, data) {
    return request.put(`/internships/${id}/approve`, data);
  },

  submitReport(id, reportTitle) {
    return request.put(`/internships/${id}/report`, { reportTitle });
  },

  updateGrade(id, data) {
    return request.put(`/internships/${id}/grade`, data);
  },

  getByStudentId(studentId, page = 0, size = 10) {
    return request.get(`/internships/student/${studentId}`, { params: { page, size } });
  },

  getByStatus(status, page = 0, size = 10) {
    return request.get(`/internships/status/${status}`, { params: { page, size } });
  },

  getStatistics() {
    return request.get('/internships/statistics');
  }
};
