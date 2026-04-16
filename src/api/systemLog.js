import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/system-logs';

export const systemLogApi = {
  getLogs(params) {
    return axios.get(API_BASE_URL, { params });
  },
  clearLogs() {
    return axios.delete(`${API_BASE_URL}/clear`);
  }
};
