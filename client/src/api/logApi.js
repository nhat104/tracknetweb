import baseApiRequest from './baseApiRequest';

const logApi = {
  list() {
    return baseApiRequest.get('logs');
  },
};

export default logApi;
