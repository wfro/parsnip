import React, { Component } from 'react';
import { connect } from 'react-redux';
import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage';
import {
  createTask,
  editTask,
  fetchBoards,
  fetchTasks,
  setCurrentBoardId,
} from './actions';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchBoards());
  }

  componentDidUpdate(nextProps) {
    if (nextProps.currentBoardId !== this.props.currentBoardId) {
      this.props.dispatch(fetchTasks(nextProps.currentBoardId));
    }
  }

  onCreateTask = ({ title, description }) => {
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = (id, status) => {
    this.props.dispatch(editTask(id, { status }));
  };

  onChangeCurrentBoard = id => {
    this.props.dispatch(setCurrentBoardId(id));
  };

  onSearch = text => {
    // this.props.dispatch(setTasksSearchFilter(text));
  };

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <TasksPage
            boards={this.props.boards}
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onStatusChange={this.onStatusChange}
            onSearch={this.onSearch}
            isLoading={this.props.isLoading}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { tasks, isLoading, error, searchFilter } = state.tasks;
  const { boards } = state.boards;
  const { currentBoardId } = state.global;

  // TODO: make it a selector
  // const filteredTasks = tasks.filter(task => task.title.match(searchFilter));

  return {
    currentBoardId,
    boards,
    tasks,
    isLoading,
    error,
  };
}

export default connect(mapStateToProps)(App);
