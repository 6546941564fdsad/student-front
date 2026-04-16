// src/api/student.js
import api from './axios';

export const studentApi = {
  getAll: (page = 0, size = 10) => api.get('/students', { params: { page, size } }),
  getStudents: () => api.get('/students'),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (student) => api.post('/students', student),
  updateStudent: (id, student) => api.put(`/students/${id}`, student),
  deleteStudent: (id) => api.delete(`/students/${id}`)
};
