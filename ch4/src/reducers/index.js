export default function tasks(state = { tasks: [] }, action) {
  switch (action.type) {
    case 'FETCH_TASKS_SUCCEEDED': {
      return {
        tasks: action.payload.tasks,
      };
    }
    case 'CREATE_TASK_SUCCEEDED': {
      return {
        tasks: state.tasks.concat(action.payload.task),
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { payload } = action;
      return {
        tasks: state.tasks.map(task => {
          if (task.id === payload.task.id) {
            return payload.task;
          }

          return task;
        }),
      };
    }
    default: {
      return state;
    }
  }
}
