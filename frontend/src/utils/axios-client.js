import axios from 'axios';

const client = axios.create();

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: logout if the error is 401
    return Promise.reject(error);
  }
);

export default client;
