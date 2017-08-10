import * as api from '../api';

export function fetchBoardsAndTasks() {
  return dispatch => {
    dispatch(fetchAllStarted());
    Promise.all([dispatch(fetchBoards()), dispatch(fetchTasks())]).then(() => {
      dispatch(fetchAllFinished());
    });
  };
}

function fetchAllStarted() {
  return { type: 'FETCH_ALL_STARTED' };
}

function fetchAllFinished() {
  return { type: 'FETCH_ALL_FINISHED' };
}

function fetchBoards() {
  return dispatch => {
    return api.fetchBoards().then(resp => {
      dispatch(fetchBoardsSucceeded(resp.data));
    });
  };
}

function fetchBoardsSucceeded(boards) {
  return { type: 'FETCH_BOARDS_SUCCEEDED', payload: { boards } };
}

export function fetchTasks() {
  return dispatch => {
    return api.fetchTasks().then(resp => {
      dispatch(fetchTasksSucceeded(resp.data));
    });
  };
}

function fetchTasksSucceeded(tasks) {
  return { type: 'FETCH_TASKS_SUCCEEDED', payload: { tasks } };
}

function createTaskSucceeded(task) {
  return {
    type: 'CREATE_TASK_SUCCEEDED',
    payload: {
      task,
    },
  };
}

export function createTask({ title, description, status = 'Unstarted' }) {
  return dispatch => {
    api.createTask({ title, description, status }).then(resp => {
      dispatch(createTaskSucceeded(resp.data));
    });
  };
}

function editTaskSucceeded(task) {
  return {
    type: 'EDIT_TASK_SUCCEEDED',
    payload: {
      task,
    },
  };
}

function progressTimerStart(taskId) {
  return { type: 'TIMER_STARTED', payload: { taskId } };
}

function progressTimerStop(taskId) {
  return { type: 'TIMER_STOPPED', payload: { taskId } };
}

export function editTask(id, params = {}) {
  return (dispatch, getState) => {
    const task = getTaskById(getState().tasks.tasks, id);
    const updatedTask = {
      ...task,
      ...params,
    };
    api.editTask(id, updatedTask).then(resp => {
      dispatch(editTaskSucceeded(resp.data));

      // if task moves into "In Progress", start timer
      if (resp.data.status === 'In Progress') {
        return dispatch(progressTimerStart(resp.data.id));
      }

      // if tasks move out of "In Progress", stop timer
      if (task.status === 'In Progress') {
        return dispatch(progressTimerStop(resp.data.id));
      }
    });
  };
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}
