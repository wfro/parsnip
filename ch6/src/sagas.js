import { call, fork, put, take } from 'redux-saga/effects';
import * as api from './api';

export default function* rootSaga() {
  yield fork(watchFetchTasks);
}

function* watchFetchTasks() {
  while (true) {
    yield take('FETCH_TASKS_STARTED');
    try {
      const tasks = yield call(api.fetchTasks);
      yield put({
        type: 'FETCH_TASKS_SUCCEEDED',
        payload: { tasks },
      });
    } catch (e) {
      yield put({
        type: 'FETCH_TASKS_FAILED',
        payload: { error: e.message },
      });
    }
  }
}
