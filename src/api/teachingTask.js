import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/teaching-tasks';

export const teachingTaskApi = {
  getTasks(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addTask(task) {
    return axios.post(API_BASE_URL, task);
  },
  deleteTask(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
