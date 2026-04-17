import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

export const userApi = {
  getUsers() {
    return axios.get(API_BASE_URL);
  },
  addUser(user) {
    return axios.post(API_BASE_URL, user);
  },
  updateUser(id, user) {
    return axios.put(`${API_BASE_URL}/${id}`, user);
  },
  deleteUser(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  },
  resetPassword(id) {
    return axios.put(`${API_BASE_URL}/${id}/reset-password`);
  }
};
