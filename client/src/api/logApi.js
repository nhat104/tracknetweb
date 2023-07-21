import baseApiRequest from './baseApiRequest';

const logApi = {
  list() {
    return baseApiRequest.get('logs');
  },
  add(action) {
    return baseApiRequest.post('logs', { action });
  },
};

export default logApi;
