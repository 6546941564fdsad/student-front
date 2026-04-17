import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/roles';

export const roleApi = {
  getRoles() {
    return axios.get(API_BASE_URL);
  },
  addRole(role) {
    return axios.post(API_BASE_URL, role);
  },
  updateRole(id, role) {
    return axios.put(`${API_BASE_URL}/${id}`, role);
  },
  deleteRole(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
