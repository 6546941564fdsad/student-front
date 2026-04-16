import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/exam-arrangements';

export const examArrangementApi = {
  getExams(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addExam(exam) {
    return axios.post(API_BASE_URL, exam);
  },
  deleteExam(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
