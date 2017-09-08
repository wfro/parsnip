import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import ConnectedApp, { App } from '../App';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('the App container', () => {
  it('should render a FlashMessage component if there is an error', () => {
    const wrapper = shallow(<App error="Boom!" />);

    expect(wrapper.find('FlashMessage').exists()).toBe(true);
  });

  it('should dispatch fetchTasks on mount', () => {
    const spy = jest.fn();
    const wrapper = mount(<App dispatch={spy} error="Boom!" tasks={[]} />);

    expect(spy).toHaveBeenCalled();
  });

  it('should fetch tasks on mount', () => {
    const middlewares = [thunk];
    const initialState = {
      tasks: {
        tasks: [],
        isLoading: false,
        error: null,
        searchTerm: '',
      },
    };
    const mockStore = configureStore(middlewares)(initialState);
    const wrapper = mount(
      <Provider store={mockStore}><ConnectedApp /></Provider>
    );
    const expectedAction = { type: 'FETCH_TASKS_STARTED' };

    expect(mockStore.getActions()[0]).toEqual(expectedAction);
  });
});
