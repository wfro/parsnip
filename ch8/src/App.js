import React, { Component } from 'react';
import { connect } from 'react-redux';
import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage';
import {
  createTask,
  editTask,
  fetchTasks,
  filterTasks,
  setCurrentBoardId,
} from './actions';
import { getGroupedAndFilteredTasks } from './reducers/';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTasks());
  }

  componentDidUpdate(nextProps) {
    if (nextProps.currentBoardId !== this.props.currentBoardId) {
      this.props.dispatch(fetchTasks(nextProps.currentBoardId));
    }
  }

  onChangeCurrentBoard = id => {
    this.props.dispatch(setCurrentBoardId(id));
  };

  onCreateTask = ({ title, description }) => {
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = (id, status) => {
    this.props.dispatch(editTask(id, { status }));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  };

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
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
  const { isLoading, error } = state.tasks;
  const boards = state.boards.items;

  return { tasks: getGroupedAndFilteredTasks(state), boards, isLoading, error };
}

export default connect(mapStateToProps)(App);
