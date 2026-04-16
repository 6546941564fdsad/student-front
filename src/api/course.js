import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/courses';

export const courseApi = {
  getCourses(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addCourse(course) {
    return axios.post(API_BASE_URL, course);
  },
  deleteCourse(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
