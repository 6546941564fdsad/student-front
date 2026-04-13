import axios from './axios';

export const internshipApi = {
  getAll(page = 0, size = 10) {
    return axios.get('/api/internships', { params: { page, size } });
  },

  add(internship) {
    return axios.post('/api/internships', internship);
  },

  getById(id) {
    return axios.get(`/api/internships/${id}`);
  },

  update(id, internship) {
    return axios.put(`/api/internships/${id}`, internship);
  },

  delete(id) {
    return axios.delete(`/api/internships/${id}`);
  },

  approve(id, data) {
    return axios.put(`/api/internships/${id}/approve`, data);
  },

  submitReport(id, reportTitle) {
    return axios.put(`/api/internships/${id}/report`, { reportTitle });
  },

  updateGrade(id, data) {
    return axios.put(`/api/internships/${id}/grade`, data);
  },

  getByStudentId(studentId, page = 0, size = 10) {
    return axios.get(`/api/internships/student/${studentId}`, { params: { page, size } });
  },

  getByStatus(status, page = 0, size = 10) {
    return axios.get(`/api/internships/status/${status}`, { params: { page, size } });
  },

  getStatistics() {
    return axios.get('/api/internships/statistics');
  }
};
