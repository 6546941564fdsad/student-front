import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/exam-arrangements';

export const examArrangementApi = {
  // 获取所有考试安排
  getExams() {
    return axios.get(API_BASE_URL);
  },
  
  // 根据ID获取考试安排
  getExamById(id) {
    return axios.get(`${API_BASE_URL}/${id}`);
  },
  
  // 根据学期筛选
  getExamsBySemester(semester) {
    return axios.get(`${API_BASE_URL}/semester/${semester}`);
  },
  
  // 根据课程名称搜索
  searchExams(courseName) {
    return axios.get(`${API_BASE_URL}/search`, { params: { courseName } });
  },
  
  // 创建考试安排
  addExam(exam) {
    return axios.post(API_BASE_URL, exam);
  },
  
  // 更新考试安排
  updateExam(id, exam) {
    return axios.put(`${API_BASE_URL}/${id}`, exam);
  },
  
  // 删除考试安排
  deleteExam(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
