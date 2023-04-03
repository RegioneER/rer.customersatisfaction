import React, { useContext, useState } from 'react';
import { TranslationsContext } from '../../TranslationsContext';
import { ApiContext } from '../../ApiContext';
import apiFetch from '../../utils/apiFetch';
import { downloadCSV } from '../CSV/ExportCSV';
import PropTypes from 'prop-types';
import { getCustomerSatisfactionLables } from '../utils';

import './Menu.less';

const Menu = () => {
  const getTranslationFor = useContext(TranslationsContext);
  const {
    portalUrl,
    fetchApi,
    handleApiResponse,
    apiErrors,
    endpoint,
    setApiErrors,
    canDelete,
  } = useContext(ApiContext);

  const labels = getCustomerSatisfactionLables(getTranslationFor);
  const clearData = () => {
    if (window.confirm(labels.deleteFeedbacksConfirm)) {
      let fetches = [
        apiFetch({
          url: portalUrl + '/@' + endpoint + '-clear',
          method: 'GET',
        }),
      ];

      Promise.all(fetches).then(data => {
        handleApiResponse(data[0]);
        fetchApi();
      });
    }
  };
  return (
    <>
      <div className="customersatisfaction-menu-wrapper">
        <div className="left-zone">
          <button
            onClick={() =>
              downloadCSV(portalUrl, endpoint, setApiErrors, getTranslationFor)
            }
            className="plone-btn plone-btn-primary context"
          >
            {labels.exportCsv}{' '}
            <i
              className="fa fas fa-download fa-lg fa-fw"
              aria-hidden={true}
            ></i>
          </button>
        </div>
        {canDelete && (
          <div className="right-zone">
            <button
              onClick={() => clearData()}
              className="plone-btn plone-btn-danger"
            >
              <i className="fa fa-trash fa-lg fa-fw" aria-hidden={true}></i>{' '}
              {labels.deleteFeedbacks}
            </button>
          </div>
        )}
      </div>

      {apiErrors && (
        <div className="errors">
          <dl className="portalMessage error" role="alert">
            <dt>Error. Status code: {apiErrors.status}</dt>
            <dd>{apiErrors.statusText}</dd>
          </dl>
        </div>
      )}
    </>
  );
};

Menu.propTypes = {
  editUser: PropTypes.func,
  setShowImportCSV: PropTypes.func,
};

export default Menu;
