import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../constants';

const initialTasksState = {
  items: [],
  isLoading: false,
  error: null,
};

export function tasks(state = initialTasksState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if (entities && entities.tasks) {
        return {
          ...state,
          isLoading: false,
          items: entities.tasks,
        };
      }

      return state;
    }
    case 'CREATE_TASK_SUCCEEDED': {
      return {
        ...state,
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}

const initialProjectsState = {
  items: [],
  isLoading: false,
  error: null,
};

export function projects(state = initialProjectsState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if (entities && entities.projects) {
        return {
          ...state,
          isLoading: false,
          items: entities.projects,
        };
      }

      return state;
    }
    case 'FETCH_PROJECTS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_PROJECTS_SUCCEEDED': {
      return {
        ...state,
        isLoading: false,
        items: action.payload.projects,
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

// TODO: how to approach this
// Problem - how do you build selectors?
//   - pass the whole state tree in
//   - pass in specific pieces of the store

// const getTasks = state => state.tasks;
const getSearchTerm = state => state.page.searchTerm;

const getTasksByProjectId = state => {
  const { currentProjectId } = state.page;

  if (!currentProjectId || !state.projects.items[currentProjectId]) {
    return [];
  }

  const taskIds = state.projects.items[currentProjectId].tasks;

  return taskIds.map(id => state.tasks.items[id]);
};

export const getFilteredTasks = createSelector(
  [getTasksByProjectId, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter(task => task.title.match(new RegExp(searchTerm, 'i')));
  },
);

// All selectors used by setGrouped... must take the same argument?
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

export const getProjects = state => {
  return Object.keys(state.projects.items).map(id => {
    return state.projects.items[id];
  });
};

const initialPageState = {
  currentProjectId: null,
};

export function page(state = initialPageState, action) {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT_ID': {
      console.log({
        ...state,
        currentProjectId: action.payload.id,
      });
      return {
        ...state,
        currentProjectId: action.payload.id,
      };
    }
    default: {
      return state;
    }
  }
}
