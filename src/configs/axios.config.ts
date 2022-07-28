import axios from 'axios';
import swal from 'sweetalert';
import AuthAction from '@action/AuthAction';
import Token from '@utils/token';

const httpService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  validateStatus: () => true
});

let isRefreshing = false;
let failedQueue: Array<{resolve: (_value: unknown) => void, reject: (_reason?: unknown) => void}> = [];

const processQueue = (error: Error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpService.interceptors.response.use(
  async response => {
    const originalRequest = response.config;
    const status = response.status || null;
    if ((status === 401 || status === 403) &&
      !(response.config.url?.includes('token/refresh'))) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return await httpService(originalRequest);
        } catch (err) {
          return await Promise.reject(err);
        }
      }

      isRefreshing = true;

      try {
        return new Promise((resolve, reject) => {
          AuthAction.refreshToken()
            .then(({ data }) => {
              if (!data.result || data.status !== 200) {
                processQueue(new Error('error'), null);
              } else {
                const payload = window.localStorage.getItem('accessToken');
                payload
                  ? Token.setToken(data.result, 'local')
                  : Token.setToken(data.result, 'session');
                httpService.defaults.headers.common['Authorization'] = `Bearer ${data.result.newAccessToken}`;
                if (originalRequest.headers) {
                  originalRequest.headers['Authorization'] = `Bearer ${data.result.newAccessToken}`;
                }
                processQueue(new Error(undefined), data.result.newAccessToken);
                resolve(httpService(originalRequest));
              }
            })
            .catch((err: Error) => {
              processQueue(err, null);
              reject(err);
              swal({
                title: 'Error',
                text: 'Session anda telah berakhir, silahkan login ulang',
                icon: 'error',
                closeOnClickOutside: false
              }).then(() => {
                Token.removeToken();
                window.location.replace('/');
              });
            })
            .finally(() => { isRefreshing = false; });
        });
      } catch (err) {}
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;
    if ((status === 401 || status === 403) && !originalRequest._retry
      && !(error.config.url.includes('token/refresh'))) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return await httpService(originalRequest);
        } catch (err) {
          return await Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        return new Promise((resolve, reject) => {
          AuthAction.refreshToken()
            .then(({ data }) => {
              if (!data.result || data.status !== 200) {
                processQueue(new Error('error'), null);
                throw new Error('');
              } else {
                const payload = window.localStorage.getItem('accessToken');
                payload
                  ? Token.setToken(data.result, 'local')
                  : Token.setToken(data.result, 'session');
                httpService.defaults.headers.common['Authorization'] = `Bearer ${data.result.newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${data.result.newAccessToken}`;
                processQueue(new Error(undefined), data.result.newAccessToken);
                resolve(httpService(originalRequest));
              }
            })
            .catch((err: Error) => {
              processQueue(err, null);
              swal({
                title: 'Error',
                text: 'Session anda telah berakhir, silahkan login ulang',
                icon: 'error',
                closeOnClickOutside: false
              }).then(() => {
                Token.removeToken();
                window.location.replace('/');
              });
              reject(err);
            })
            .finally(() => { isRefreshing = false; });
        });
      } catch (err) {}
    }
    return Promise.reject(error);
  }
);

export default httpService;
