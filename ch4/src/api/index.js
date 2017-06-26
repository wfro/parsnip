import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export function fetchTasks() {
  return axios.get(`${API_BASE_URL}/tasks`);
}

export function createTask(params) {
  return axios.post(`${API_BASE_URL}/tasks`, params);
}

export function editTask(id, params) {
  return axios.put(`${API_BASE_URL}/tasks/${id}`, params);
}
