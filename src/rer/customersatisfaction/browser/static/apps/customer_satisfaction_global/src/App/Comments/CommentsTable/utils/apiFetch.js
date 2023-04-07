// Some archaic js code here 	ʕ •́؈•̀)
import axios from 'axios';


import { SITES_LIST_URL, SITE_URL, COMMENTS_LIST_SUFFIX } from './apiConfing';

document.querySelector('body').setAttribute('axios', axios);

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

const apiFetchSitesList = () => {
  return apiFetch({ method: "GET", url: SITES_LIST_URL });
}

const apiFetchCommentsBySite = (siteId) => {
  return apiFetch({ method: "GET", url: SITE_URL + siteId + '/' + COMMENTS_LIST_SUFFIX, params: { b_size: 0xF4240 } });
}

export { apiFetch, apiFetchSitesList, apiFetchCommentsBySite };
