import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../constants';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  searchTerm: '',
};

export function projects(state = initialState, action) {
  switch (action.type) {
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
    case 'CREATE_TASK_SUCCEEDED': {
      // TODO: oh my..
      const { task } = action.payload;
      const projectIndex = state.items.findIndex(
        project => project.id === task.projectId,
      );
      const project = state.items[projectIndex];

      const nextProject = {
        ...project,
        tasks: project.tasks.concat(task),
      };

      return {
        ...state,
        items: [
          ...state.items.slice(0, projectIndex),
          nextProject,
          ...state.items.slice(projectIndex + 1),
        ],
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      // TODO: might still not work
      const { task } = action.payload;
      const projectIndex = state.items.findIndex(
        project => project.id === task.projectId,
      );
      const project = state.items[projectIndex];
      const taskIndex = project.tasks.findIndex(t => t.id === task.id);

      const nextProject = {
        ...project,
        tasks: [
          ...project.tasks.slice(0, taskIndex),
          task,
          ...project.tasks.slice(taskIndex + 1),
        ],
      };

      return {
        ...state,
        items: [
          ...state.items.slice(0, projectIndex),
          nextProject,
          ...state.items.slice(projectIndex + 1),
        ],
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
const getSearchTerm = state => state.searchTerm;

const getTasksByProjectId = state => {
  if (!state.global.currentProjectId) {
    return [];
  }

  const currentProject = state.projects.items.find(
    project => project.id === state.global.currentProjectId,
  );

  return currentProject.tasks;
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

const initialGlobalState = {
  currentProjectId: null,
};

export function global(state = initialGlobalState, action) {
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
