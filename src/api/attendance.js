import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/attendances';

export const attendanceApi = {
  getAttendances(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addAttendance(attendance) {
    return axios.post(API_BASE_URL, attendance);
  },
  deleteAttendance(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
