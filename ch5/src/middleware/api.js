import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; //#A

export const CALL_API = 'CALL_API';

function makeCall(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`; //#B

  return axios
    .get(url)
    .then(resp => {
      return resp; //#C
    })
    .catch(err => {
      return err; //#C
    });
}

const apiMiddleware = store => next => action => {
  const callApi = action[CALL_API];
  if (typeof callApi === 'undefined') {
    return next(action);
  }

  const [requestStartedType, successType, failureType] = callApi.types;

  next({ type: requestStartedType });
};

export default apiMiddleware;
