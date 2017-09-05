import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './components/Header';
import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage';
import {
  createTask,
  editTask,
  fetchProjects,
  filterTasks,
  setCurrentProjectId,
} from './actions';
import { getGroupedAndFilteredTasks } from './reducers/';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchProjects());
  }

  // Maybe we can just omit this for first round
  // componentDidUpdate(nextProps) {
  //   if (nextProps.currentBoardId !== this.props.currentBoardId) {
  //     this.props.dispatch(fetchTasks(nextProps.currentBoardId));
  //   }
  // }
  //
  onCurrentProjectChange = e => {
    this.props.dispatch(setCurrentProjectId(Number(e.target.value)));
  };

  onCreateTask = ({ title, description }) => {
    this.props.dispatch(
      createTask({
        title,
        description,
        projectId: this.props.currentProjectId,
      }),
    );
  };

  onStatusChange = (task, status) => {
    this.props.dispatch(editTask(task, { status }));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  };

  // TODO: connect tasks at a lower level?

  // TODO: try and separate concerns between bprojectoards and tasks, projects has it's own loading state (in the dropdown can so Loading... etc)
  // Think about a UI that has projects and tasks separated - trello, not even a concern?

  render() {
    // TODO: after break: go back and fill in the current project shit
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <Header
            projects={this.props.projects}
            onCurrentProjectChange={this.onCurrentProjectChange}
          />
          <TasksPage
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onSearch={this.onSearch}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading, error, items } = state.projects;

  return {
    tasks: getGroupedAndFilteredTasks(state),
    projects: items,
    isLoading,
    error,
  };
}

export default connect(mapStateToProps)(App);
