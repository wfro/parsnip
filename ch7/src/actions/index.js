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

export const FETCH_BOARDS_STARTED = 'FETCH_BOARDS_STARTED';
function fetchBoardsStarted(boards) {
  return { type: FETCH_BOARDS_STARTED, payload: { boards } };
}

export const FETCH_BOARDS_SUCCEEDED = 'FETCH_BOARDS_SUCCEEDED';
function fetchBoardsSucceeded(boards) {
  return { type: FETCH_BOARDS_SUCCEEDED, payload: { boards } };
}

export const FETCH_BOARDS_FAILED = 'FETCH_BOARDS_FAILED';
function fetchBoardsFailed(err) {
  return { type: FETCH_BOARDS_FAILED, payload: err };
}

export const SET_CURRENT_BOARD_ID = 'SET_CURRENT_BOARD_ID';
export function setCurrentBoardId(id) {
  return {
    type: 'SET_CURRENT_BOARD_ID',
    payload: {
      id,
    },
  };
}

// NOTE: maybe "projects" is a better name
// NOTE: these could replace /tasks with these, this is more along the lines of what i'd do in a real app. But /tasks is also fine I think
// function fetchBoardStarted() {
//   return {
//     type: 'FETCH_BOARD_STARTED'
//   }
// }
//
// function fetchBoardSucceeded(board) {
//   return {
//     type: 'FETCH_BOARD_SUCEEDED',
//     payload: {
//       board
//     }
//   }
// }
//
// function fetchBoard(id) {
//   return (dispatch) => {
//     dispatch(fetchBoardStarted());
//
//     return api.fetchBoard(id).then(resp => {
//       dispatch(fetchBoardSucceeded(resp.data));
//     });
//   };
// }

export function fetchBoards() {
  return (dispatch, getState) => {
    dispatch(fetchBoardsStarted());

    return api.fetchBoards().then(resp => {
      const boards = resp.data;

      // Pick a board to show on initial page load
      if (!getState().global.currentBoardId) {
        // TODO: This feels awkward for some reason, can't explain it.
        const defaultBoardId = boards[0].id;
        dispatch(setCurrentBoardId(defaultBoardId));
        dispatch(fetchTasks(defaultBoardId));
      }

      dispatch(fetchBoardsSucceeded(boards));
    });
  };
}

export function fetchTasks(boardId) {
  return dispatch => {
    return api.fetchTasks(boardId).then(resp => {
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

export function setTasksSearchFilter(text) {
  return {
    type: 'SET_TASKS_SEARCH_FILTER',
    payload: {
      text,
    },
  };
}
