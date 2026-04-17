import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/data-dictionaries';

export const dataDictionaryApi = {
  getDictionaries(params) {
    return axios.get(API_BASE_URL, { params });
  },
  addDictionary(dictionary) {
    return axios.post(API_BASE_URL, dictionary);
  },
  updateDictionary(id, dictionary) {
    return axios.put(`${API_BASE_URL}/${id}`, dictionary);
  },
  deleteDictionary(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
