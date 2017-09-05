import React, { Component } from 'react';
// import { connect } from 'react-redux';
import TaskList from './TaskList';

// TODO: eventually connect this?
// parent passes in ID, TasksPage fetches the right stuff
class TasksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewCardForm: false,
      title: '',
      description: '',
    };
  }

  onTitleChange = e => {
    this.setState({ title: e.target.value });
  };

  onDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  resetForm() {
    this.setState({
      showNewCardForm: false,
      title: '',
      description: '',
    });
  }

  onCreateTask = e => {
    e.preventDefault();
    this.props.onCreateTask({
      title: this.state.title,
      description: this.state.description,
    });
    this.resetForm();
  };

  toggleForm = () => {
    this.setState({ showNewCardForm: !this.state.showNewCardForm });
  };

  renderTaskLists() {
    const { onStatusChange, tasks } = this.props;

    return Object.keys(tasks).map(status => {
      const tasksByStatus = tasks[status];

      return (
        <TaskList
          key={status}
          status={status}
          tasks={tasksByStatus}
          onStatusChange={onStatusChange}
        />
      );
    });
  }

  onSearch = e => {
    this.props.onSearch(e.target.value);
  };

  render() {
    if (this.props.isLoading) {
      return <div className="tasks-loading">Loading...</div>;
    }

    return (
      <div className="tasks">
        <div className="tasks-header">
          <input onChange={this.onSearch} type="text" placeholder="Search..." />
          <button className="button button-default" onClick={this.toggleForm}>
            + New task
          </button>
        </div>

        {this.state.showNewCardForm &&
          <form className="new-task-form" onSubmit={this.onCreateTask}>
            <input
              className="full-width-input"
              onChange={this.onTitleChange}
              value={this.state.title}
              type="text"
              placeholder="title"
            />
            <input
              className="full-width-input"
              onChange={this.onDescriptionChange}
              value={this.state.description}
              type="text"
              placeholder="description"
            />
            <button className="button" type="submit">
              Save
            </button>
          </form>}

        <div className="task-lists">
          {this.renderTaskLists()}
        </div>
      </div>
    );
  }
}

// TODO: scratch
// class TasksPageContainer extends Component {
//   render() {
//     return (
//       <TasksPage
//         tasks={this.props.tasks}
//         projects={this.props.projects}
//         onCreateTask={this.onCreateTask}
//         onSearch={this.onSearch}
//         onStatusChange={this.onStatusChange}
//         isLoading={this.props.isLoading}
//       />
//     );
//   }
// }
//
// // {
// //   project: {
// //     id: 1,
// //     title: ‘Short-Term Goals’,
// //     tasks: [
// //       {
// //         id: 5,
// //         title: 'Learn Redux',
// //         user: {
// //           id: 1,
// //           name: 'Richard Roe',
// //         }
// //       },
// //     ],
// //     isLoading: false,
// //     error: null,
// //     searchTerm: '',
// //   }
// // }
// //
// //
// // {
// //   project: {
// //     id: 1,
// //     title: 'Short-Term Goals',
// //     tasks: [
// //       { id: 3, title: 'Learn Redux' },
// //       { id: 5, title: 'Defend shuffleboard world championship title' },
// //     ],
// //     isLoading: false,
// //     error: null,
// //     searchTerm: '',
// //   },
// // }
// //
//
// {
//  id: 1,
//  title: 'Short-Term Goals',
//  tasks: [
//    { id: 3, title: 'Learn Redux' },
//    { id: 5, title: 'Defend shuffleboard world championship title' },
//  ],
//
// {
//   projects: {
//     isLoading: false,
//     error: null,
//     items: [
//       {
//         id: 1,
//         name: 'Short-term goals',
//         tasks: [
//           { id: 1, projectId: 1, ... },
//           { id: 2, projectId: 1, ... }
//         ]
//       },
//       {
//         id: 2,
//         name: 'Short-term goals',
//         tasks: [
//           { id: 3, projectId: 2, ... },
//           { id: 4, projectId: 2, ... }
//         ]
//       }
//     ]
//   },
//   page: {
//     currentProjectId: null
//   }
// }
//
// [
//   {
//     id: 1,
//     name: 'Short-term goals',
//     tasks: [
//       { id: 1, title: 'Learn Redux', status: 'In Progress' },
//       { id: 2, title: 'Defend shuffleboard championship title', status: 'Unstarted' }
//     ]
//   },
//   {
//     id: 1,
//     name: 'Short-term goals',
//     tasks: [
//       { id: 3, title: 'Achieve world peace', status: 'In Progress' },
//       { id: 4, title: 'Invent Facebook for dogs', status: 'Unstarted' }
//     ]
//   }
// ]
// }

// function mapStateToProps(state) {
//   const { isLoading, error } = state.tasks;
//   return {
//     isLoading,
//     error,
//     // TODO: better between getting projectId from parent, or getting it from redux?
//     // what if we want to render tasks not for just this project, e.g. for all projects?
//     items: getGroupedAndFilteredTasks(state),
//   };
// }

export default TasksPage;
