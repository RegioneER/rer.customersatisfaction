import axios from 'axios';

const parseParams = params => {
  const keys = Object.keys(params);
  let options = '';

  keys.forEach(key => {
    const isParamTypeObject = typeof params[key] === 'object';
    const isParamTypeArray = isParamTypeObject && params[key].length >= 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach(element => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

const apiFetch = ({ url, params, method }) => {
  if (!method) {
    method = 'GET';
  }
  var headers = { Accept: 'application/json' };

  return axios({
    method,
    url,
    params: method == 'GET' ? params : null,
    data: ['POST', 'PATCH'].indexOf(method) >= 0 ? params : null,
    //paramsSerializer: params => parseParams(params),
    headers,
  });
};

export default apiFetch;
