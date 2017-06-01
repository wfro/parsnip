import React, { Component } from 'react';
import TaskList from '../components/TaskList';

import { TASK_STATUSES } from '../constants';

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

  render() {
    const init = Object.keys(TASK_STATUSES).reduce((grouped, status) => {
      grouped[TASK_STATUSES[status]] = [];
      return grouped;
    }, {});

    const groupedTasks = this.props.tasks.reduce((grouped, task) => {
      grouped[task.status].push(task);
      return grouped;
    }, init);

    return (
      <div className="tasks">
        <div className="tasks-header">
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
          {Object.keys(groupedTasks).map(status => {
            const tasks = groupedTasks[status];
            return (
              <TaskList
                key={status}
                status={status}
                tasks={tasks}
                onStatusChange={this.props.onStatusChange}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default TasksPage;
