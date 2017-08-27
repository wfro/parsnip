import * as api from '../api';

export const SET_CURRENT_BOARD_ID = 'SET_CURRENT_BOARD_ID';
export function setCurrentBoardId(id) {
  return {
    type: 'SET_CURRENT_BOARD_ID',
    payload: {
      id,
    },
  };
}

function fetchBoardStarted() {
  return {
    type: 'FETCH_BOARD_STARTED',
  };
}

function fetchBoardSucceeded(board) {
  return {
    type: 'FETCH_BOARD_SUCEEDED',
    payload: {
      board,
    },
  };
}

export function fetchBoard(id) {
  return dispatch => {
    dispatch(fetchBoardStarted());

    return api.fetchBoard(id).then(resp => {
      dispatch(fetchBoardSucceeded(resp.data));
    });
  };
}

/////////
// BOARDS
/////////

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

export function fetchBoards() {
  return (dispatch, getState) => {
    dispatch(fetchBoardsStarted());

    return api
      .fetchBoards()
      .then(resp => {
        const boards = resp.data;

        // Pick a board to show on initial page load
        if (!getState().global.currentBoardId) {
          // TODO: This feels awkward for some reason, can't explain it.
          const defaultBoardId = boards[0].id;
          dispatch(setCurrentBoardId(defaultBoardId));
          dispatch(fetchTasks(defaultBoardId));
        }

        dispatch(fetchBoardsSucceeded(boards));
      })
      .catch(err => {
        fetchBoardsFailed(err);
      });
  };
}

// TODO: do these get migrated over to fetchBoard
export function fetchTasksStarted() {
  return {
    type: 'FETCH_TASKS_STARTED',
  };
}

export function fetchTasksSucceeded() {
  return {
    type: 'FETCH_TASKS_SUCCEEDED',
  };
}

export function fetchTasks(boardId) {
  return dispatch => {
    return api.fetchTasks(boardId).then(resp => {
      dispatch(fetchTasksSucceeded(resp.data));
    });
  };
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

// TODO: Goal: three commits with each stage of the process
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

function progressTimerStart(taskId) {
  return { type: 'TIMER_STARTED', payload: { taskId } };
}

function progressTimerStop(taskId) {
  return { type: 'TIMER_STOPPED', payload: { taskId } };
}

export function filterTasks(searchTerm) {
  return { type: 'FILTER_TASKS', searchTerm };
}
