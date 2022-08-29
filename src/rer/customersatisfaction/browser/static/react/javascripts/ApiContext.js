import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';

import apiFetch from './utils/apiFetch';

export const ApiContext = React.createContext({});

export const ApiProvider = ApiContext.Provider;
export const ApiConsumer = ApiContext.Consumer;

export const DEFAULT_B_SIZE = 25;
export const DEFAULT_SORT_ON = 'last_vote';
export const DEFAULT_SORT_ORDER = 'descending';

function ApiWrapper({ endpoint, children, canDelete }) {
  const [data, setData] = useState({});
  const [portalUrl, setPortalUrl] = useState(null);

  const [apiErrors, setApiErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [b_size, setB_size] = useState(DEFAULT_B_SIZE);

  const [sort_on, setSort_on] = useState(DEFAULT_SORT_ON);
  const [sort_order, setSort_order] = useState(DEFAULT_SORT_ORDER);

  const handleApiResponse = res => {
    if (res?.status == 204 || res?.status == 200) {
      //ok
    } else {
      setApiErrors(
        res
          ? { status: res.status, statusText: res.statusText }
          : { status: '404', statusText: '' },
      );
    }
  };

  const fetchApi = (b_start = 0, query) => {
    if (portalUrl) {
      setLoading(true);
      apiFetch({
        url: portalUrl + '/@' + endpoint,
        params: {
          b_size,
          b_start,
          sort_on,
          sort_order,
          ...query,
        },
        method: 'GET',
      })
        .then(data => {
          if (data === undefined) {
            setApiErrors({ status: 500, statusText: 'Error' });
            setLoading(false);
            return;
          }
          handleApiResponse(data);
          setData(data.data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          if (error && error.response) {
            setApiErrors({
              status: error.response.status,
              statusText: error.message,
            });
          }
        });
    }
  };

  useEffect(() => {
    const portalUrl = document
      .querySelector('body')
      .getAttribute('data-portal-url');
    if (!portalUrl) {
      return;
    }

    setPortalUrl(portalUrl);
  }, []);

  useEffect(() => {
    if (portalUrl) {
      fetchApi();
    }
  }, [portalUrl, b_size, sort_on, sort_order]);

  const handlePageChange = page => {
    fetchApi(b_size * (page - 1));
  };

  const setSorting = (column, order) => {
    setSort_on(column);
    setSort_order(order === 'asc' ? 'ascending' : 'descending');
  };

  return (
    <ApiProvider
      value={{
        fetchApi,
        data,
        portalUrl,
        handleApiResponse,
        setB_size,
        b_size,
        setSorting,
        sort_on,
        sort_order,
        handlePageChange,
        apiErrors,
        setApiErrors,
        loading,
        endpoint,
        canDelete,
      }}
    >
      {children}
    </ApiProvider>
  );
}

ApiWrapper.propTypes = {
  children: object,
};

export default ApiWrapper;
