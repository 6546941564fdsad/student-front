import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/course-selections';

export const courseSelectionApi = {
  getSelections(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addSelection(selection) {
    return axios.post(API_BASE_URL, selection);
  },
  deleteSelection(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
