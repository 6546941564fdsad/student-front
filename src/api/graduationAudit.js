import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/graduation-audits';

export default {
  getAudits(params) {
    return axios.get(API_BASE_URL, { params });
  },
  updateAudit(id, audit) {
    return axios.put(`${API_BASE_URL}/${id}`, audit);
  }
};
