import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/student-punishments';

export default {
  getPunishments(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addPunishment(punishment) {
    return axios.post(API_BASE_URL, punishment);
  },
  updatePunishment(id, punishment) {
    return axios.put(`${API_BASE_URL}/${id}`, punishment);
  },
  deletePunishment(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
