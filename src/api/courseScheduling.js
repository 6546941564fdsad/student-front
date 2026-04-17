import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/course-schedules';

export default {
  getSchedules() {
    return axios.get(API_BASE_URL);
  },
  addSchedule(schedule) {
    return axios.post(API_BASE_URL, schedule);
  },
  updateSchedule(id, schedule) {
    return axios.put(`${API_BASE_URL}/${id}`, schedule);
  },
  deleteSchedule(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
