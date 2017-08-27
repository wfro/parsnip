import React, { Component } from 'react';
import { connect } from 'react-redux';
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

  onStatusChange = (id, status) => {
    this.props.dispatch(editTask(id, { status }));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  };

  renderBoardDropdown() {
    const projectOptions = this.props.projects.map(project =>
      <option key={project.id} value={project.id}>
        {project.name}
      </option>,
    );

    return (
      <div className="project-item">
        Board:
        <select onChange={this.onCurrentProjectChange} className="project-menu">
          {projectOptions}
        </select>
      </div>
    );
  }

  // TODO: connect tasks at a lower level?

  // TODO: try and separate concerns between bprojectoards and tasks, projects has it's own loading state (in the dropdown can so Loading... etc)
  // Think about a UI that has projects and tasks separated - trello, not even a concern?

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          {this.renderBoardDropdown()}
          <TasksPage
            tasks={this.props.tasks}
            projects={this.props.projects}
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

  //  TODO: rfc - we need currentProjectId to create a new task, do we get it from
  //   1) here, and have App pass it directly to the action
  //   2) Use thunks and getState to grab it before making the request
  const { currentProjectId } = state.global;

  return {
    tasks: getGroupedAndFilteredTasks(state),
    projects: items,
    isLoading,
    currentProjectId,
    error,
  };
}

export default connect(mapStateToProps)(App);
