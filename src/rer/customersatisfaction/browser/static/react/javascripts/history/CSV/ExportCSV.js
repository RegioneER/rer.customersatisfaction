import apiFetch from '../../utils/apiFetch';
import { saveAs } from 'file-saver';

export const downloadCSV = (
  portalUrl,
  endpoint,
  setApiErrors,
  getTranslationFor,
) => {
  apiFetch({
    url: portalUrl + '/@' + endpoint + '-csv',
    method: 'GET',
  })
    .then(res => {
      if (!res) {
        setApiErrors({
          status: 404,
          statusText: getTranslationFor(
            'Url not found. Unable to download this file.',
            'Url not found. Unable to download this file.',
          ),
        });
        return;
      }
      if (res.status !== 200) {
        switch (res.status) {
          case 401:
          case 403:
            setApiErrors({
              status: res.status,
              statusText: getTranslationFor(
                'You do not have permission to download this file.',
                'You do not have permission to download this file.',
              ),
            });
            return;
          default:
            setApiErrors({
              status: res.status,
              statusText: getTranslationFor(
                'An error occurred downloading file.',
                'An error occurred downloading file.',
              ),
            });
            return;
        }
      }
      if (!res.data || res.data.length === 0) {
        setApiErrors({
          status: res.status,
          statusText: getTranslationFor(
            'An error occurred downloading file.',
            'An error occurred downloading file.',
          ),
        });
        return;
      }
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const disposition = res.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const matches = filenameRegex.exec(disposition);
        const filename = matches[1].replace(/['"]/g, '');
        const blob = new Blob([res.data], {
          type: res.headers['content-type'],
        });
        saveAs(blob, filename);
      }
    })
    .catch(err => {
      console.error(err);
      setApiErrors({
        status: 500,
        statusText: err.message,
      });
    });
};
