export const CALL_API = 'CALL_API';

const apiMiddleware = store => next => action => {
  const callApi = action[CALL_API];
  if (typeof callApi === 'undefined') {
    return next(action);
  }
};

export default apiMiddleware;
