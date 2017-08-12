import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function fetchBoards() {
  return client.get('/boards');
}

export function fetchBoard(id) {
  // NOTE: this might be easier to accomplish by just nesting the data from the API.
  return client.get('/boards/id?_embed=tasks');
}

export function fetchTasks(boardId) {
  return client.get(`/boards/${boardId}/tasks`);
}

export function createTask(params) {
  return client.post('/tasks', params);
}

export function editTask(id, params) {
  return client.put(`/tasks/${id}`, params);
}
