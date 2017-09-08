import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
// import axios from 'axios';
import sinon from 'sinon';
// import mockAdapter from 'axios-mock-adapter';
import { createTask, createTaskSucceeded } from '../actions/';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('action creators:', () => {
  it('createTaskSucceeded', () => {
    const task = {
      title: 'Get schwifty',
      description: 'Show me what you got',
    };
    const expectedAction = {
      type: 'CREATE_TASK_SUCCEEDED',
      payload: {
        task,
      },
    };

    expect(createTaskSucceeded(task)).toEqual(expectedAction);
  });

  xit('createTask', () => {
    const task = {
      title: 'Get schwifty',
      description: 'Show me what you got',
    };
    const expectedActions = [
      { type: 'CREATE_TASK_REQUESTED' },
      { type: 'CREATE_TASK_SUCCEEDED', payload: { task } },
    ];

    // const mock = new mockAdapter(axios);
    // mock.onPost(/tasks/).reply(201, { task });

    const server = sinon.fakeServer.create();
    server.respondWith('POST', /./, [
      201,
      { 'Content-Type': 'application.json' },
      JSON.stringify({ task }),
    ]);

    const store = mockStore({ tasks: { tasks: [] } });

    return store.dispatch(createTask(task)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
