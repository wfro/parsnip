import {
  FETCH_BOARDS_STARTED,
  FETCH_BOARDS_SUCCEEDED,
  SET_CURRENT_BOARD_ID,
} from '../actions';

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  searchText: null,
};

export function tasks(state = initialState, action) {
  switch (action.type) {
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

    // What to do for reducer state for the current board?
    //
    // Flow
    //
    // Page loads
    // fetch all boards for the dropdown
    //   App.js fetchBoards
    // pick the first board
    //   when fetchBoards returns, call SET_CURRENT_BOARD with board id
    //   which sets in the currentBoard reducer
    // fetch board with tasks for the page
    case FETCH_BOARDS_STARTED: {
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
    case 'SET_TASKS_SEARCH_FILTER': {
      return {
        searchText: action.payload.text,
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}

const initialBoardsState = {
  boards: [],
  isLoading: false,
  error: null,
};

export function boards(state = initialBoardsState, action) {
  switch (action.type) {
    // NOTE: nit, but I like this better as FETCH_ALL_BOARDS. the whole board/boards thing always, always, always leads to bugs
    case FETCH_BOARDS_STARTED: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FETCH_BOARDS_SUCCEEDED: {
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
    case SET_CURRENT_BOARD_ID: {
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
