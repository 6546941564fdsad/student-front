import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/student-status-changes';

export default {
  getChanges(params) {
    return axios.get(API_BASE_URL, { params });
  },
  updateChange(id, change) {
    return axios.put(`${API_BASE_URL}/${id}`, change);
  },
  deleteChange(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
