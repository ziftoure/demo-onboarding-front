import Axios from 'axios';
import VueCookies from 'vue-cookies';
import { createToast } from 'mosha-vue-toastify';
import router from '../router';

const APIBaseURL = process.env.VUE_APP_BACKEND_URL;

const adapter = Axios.create({
  baseURL: APIBaseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: process.env.VUE_APP_API_KEY,
  },
});

const shortenerAdapter = Axios.create({
  baseURL: process.env.VUE_APP_MYDID_URL_SHORTENER_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: process.env.VUE_APP_MYDID_URL_SHORTENER_KEY,
  },
});

function eachRecursive(obj) {
  for (var k in obj) {
    if (typeof obj[k] == 'object' && obj[k] !== null) eachRecursive(obj[k]);
    else if (obj[k] == null) obj[k] = '';
  }
}

export default {
  install(app) {
    adapter.interceptors.response.use(
      (response) => {
        eachRecursive(response.data);
        return response;
      },
      (error) => {
        if (error.response) {
          if (
            error.response.status === 404 ||
            error.response.status === 401 ||
            error.response.status === 500 ||
            error.response.status === 503
          ) {
            VueCookies.remove('token');
            router.push('/');
          }
        }

        if (error.message === 'Network Error') {
          console.log("Can't reach server");
          createToast("Can't reach server, please try again later", {
            position: 'bottom-center',
            hideProgressBar: true,
            toastBackgroundColor: 'blue',
          });
          router.push('/');
        }

        return Promise.reject(error);
      }
    );

    var evtSource = null;

    var api = {
      shortenLink(link) {
        return shortenerAdapter.post(`/firebase/create`, {
          urlData: link,
        });
      },
      createChallenge(schema) {
        return adapter.post('/auth/challenge', {
          schema,
        });
      },
      getRequestInfos(id) {
        return adapter.get(`/request/${id}`);
      },
      getAllowedFields() {
        return adapter.get('/auth/allowed-fields');
      },
      getExternalJsonWithJsonp(url) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          const callbackName =
            'jsonp_callback_' + Math.round(100000 * Math.random());

          window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
          };

          script.src = `${url}?callback=${callbackName}`;
          script.onerror = (error) => {
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('JSONP request failed'));
          };

          document.body.appendChild(script);
        });
      },
    
      waitChallengeValidation(id, next) {
        evtSource = new EventSource(APIBaseURL + '/auth/sse/' + id, {
          xhrHeaders: {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
          },
        });

        evtSource.addEventListener(
          'message',
          (event) => {
            let response;
            try {
              const parsedData = JSON.parse(event.data);
              response = parsedData.data;
            } catch (error) {
              console.error('Error parsing event data:', error);
              return;
            }

            if (!response) {
              console.error('No data in the response');
              return;
            }
            //console.log('Receive elements from stream : ', response);

            if (response.status === 'validated' && response.challenge === id) {
              console.log('Great, authentication validated');
              evtSource.close();
              return next(response);
            } else if (response.status === 'expired') {
              console.log('Challenge expired, authentication refused');
              evtSource.close();
              return next(response);
            } else if (response.status) {
              next(response);
            } else {
              console.error('Unexpected response format:', response);
            }
          },
          false
        );

        evtSource.addEventListener(
          'error',
          (error) => {
            console.error('SSE Error:', error);
            if (evtSource.readyState === EventSource.CLOSED) {
              console.log('SSE connection was closed');
            }
            next({ status: 'error', message: 'SSE connection error' });
          },
          false
        );

        return evtSource;
      },

      closeChallengeValidation() {
        if (evtSource) evtSource.close();
      },
    };
    app.provide('$api', api);
  },
};
