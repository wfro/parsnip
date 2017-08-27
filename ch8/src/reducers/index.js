import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../constants';

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  searchTerm: '',
};

// Two choices
//   - keep all boards, and current board in same reducer
//   - have a separate reducer for current board with expanded data
// This all depends on what the API looks like.
// Is the response for all boards, and a single board different?

// What does reddit do for
// subreddits - fetch subreddits. fetch subreddit
//   subreddit - ?
//     posts - fetch posts
//       post - ?
//         comments
// trello pheonix thing
//   currentBoard reducer, boards reducer
// trello
//   boards in index: api/me?boards=open - they let query params give a lot of flexibility here
//   board show: api/boards/:id?cards=open
//

// What to do for reducer state for the current board?
//
// Flow:
//
// Page loads
// fetch all boards for the dropdown
//   App.js fetchBoards
// pick the first board
//   when fetchBoards returns, call SET_CURRENT_BOARD with board id
//   which sets in the currentBoard reducer
// fetch board with tasks for the page
export function tasks(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_BOARDS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_TASKS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_TASKS_SUCCEEDED': {
      return {
        ...state,
        tasks: action.payload.tasks,
        isLoading: false,
      };
    }
    case 'FETCH_TASKS_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case 'CREATE_TASK_SUCCEEDED': {
      return {
        ...state,
        tasks: state.tasks.concat(action.payload.task),
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { payload } = action;
      const nextTasks = state.tasks.map(task => {
        if (task.id === payload.task.id) {
          return payload.task;
        }

        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      };
    }
    case 'TIMER_INCREMENT': {
      const nextTasks = state.tasks.map(task => {
        if (task.id === action.payload.taskId) {
          return { ...task, timer: task.timer + 1 };
        }

        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      };
    }
    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.searchTerm };
    }
    default: {
      return state;
    }
  }
}

const getTasks = state => state.tasks.tasks;
const getSearchTerm = state => state.tasks.searchTerm;

export const getFilteredTasks = createSelector(
  [getTasks, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter(task => task.title.match(new RegExp(searchTerm, 'i')));
  },
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  tasks => {
    const grouped = {};

    TASK_STATUSES.forEach(status => {
      grouped[status] = tasks.filter(task => task.status === status);
    });

    return grouped;
  },
);

// TODO:
// OK, first, update the API to return tasks nested within boards. This is most likely what you'll get from a real world API
//   Mention shielding the frontend app from changes by having a layer that translates between API and frontend (normalization!)
//     Keep reducers consistent, other components can translate data in and out of the reducer
//     Reinforce decoupling - having these layers between core components allows them to stay unchanged, and changes can be isolated to the connections between them
//   Explain this idea of "normalizing", what does that even mean?
// Why is it good to have an object keyed by id instead of an array?

// OK, first, update the API to return tasks nested within boards. This is most likely what you'll get from a real world API
// this could go in three stages
// 1) convert tasks to boards reducer, leave everything as is
// 2) move tasks into separate reducer, normalize API response manually
// 3) bring in normalizr

const initialBoardsState = {
  boards: [],
  isLoading: false,
  error: null,
};

export function boards(state = initialBoardsState, action) {
  switch (action.type) {
    case 'FETCH_BOARDS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_BOARDS_SUCCEEDED': {
      return {
        ...state,
        boards: action.payload.boards,
      };
    }
    // NOTE: Likely don't need this
    // case 'FETCH_BOARD_SUCCEEDED': {
    //   // TODO: this might need a different section, how do we show loading on show vs. index?
    //   const index = state.boards.findIndex(
    //     board => board.id === action.payload.board.id,
    //   );
    //
    //   return {
    //     boards: [
    //       state.boards.slice(0, index),
    //       action.payload.board,
    //       state.boards.slice(state.boards.length),
    //     ],
    //     ...state,
    //   };
    // }
    default: {
      return state;
    }
  }
}

const initialGlobalState = {
  currentBoardId: null,
};

export function global(state = initialGlobalState, action) {
  switch (action) {
    case 'SET_CURRENT_BOARD_ID': {
      return {
        currentBoardId: action.payload.id,
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
