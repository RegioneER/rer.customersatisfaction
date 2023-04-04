import React, { useState, useEffect, useContext } from 'react';
import DataTable from 'react-data-table-component';
import format from 'date-fns/format';
import { TranslationsContext } from '../../TranslationsContext';
import Select from 'react-select';
import {
  ApiContext,
  DEFAULT_B_SIZE,
  DEFAULT_SORT_ON,
  DEFAULT_SORT_ORDER,
} from '../../ApiContext';
import apiFetch from '../../utils/apiFetch';
import { getCustomerSatisfactionLables } from '../utils';

import './index.less';

const CustomerSatisfactionList = () => {
  const getTranslationFor = useContext(TranslationsContext);
  const {
    data,
    portalUrl,
    fetchApi,
    loading,
    handleApiResponse,
    setB_size,
    handlePageChange,
    b_size,
    setSorting,
    canDelete,
  } = useContext(ApiContext);
  const labels = getCustomerSatisfactionLables(getTranslationFor);
  const [filters, setFilters] = useState({});
  const [textTimeout, setTextTimeout] = useState(0);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  //------------------COLUMNS----------------------
  const columns = [
    {
      id: 'title',
      name: labels.page,
      selector: row => row.title,
      sortable: true,
      sortField: 'title',
      cell: row => {
        return row.url ? (
          <div className="col-title">
            <a
              href={row.url}
              title={'Apri ' + row.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.title}
            </a>
          </div>
        ) : (
          <div>{row.title}</div>
        );
      },
    },
    {
      id: 'ok',
      name: labels.ok,
      selector: row => row.ok,
      sortable: true,
      sortField: 'ok',
      width: '120px',
    },
    {
      id: 'nok',
      name: labels.nok,
      selector: row => row.nok,
      sortable: true,
      sortField: 'nok',
      width: '120px',
    },
    {
      id: 'last_vote',
      name: labels.last_voted,
      selector: row => row.last_vote,
      sortable: true,
      sortField: 'last_vote',
      cell: row => (
        <div>
          {row.last_vote
            ? format(new Date(row.last_vote), 'dd/MM/yyyy HH:mm:ss')
            : ''}
        </div>
      ),
      width: '160px',
    },
    {
      id: 'comments',
      name: labels.comments,
      selector: row => row.comment,
      sortable: true,
      sortField: 'comments',
      width: '100px',

      cell: row => (
        <div className="comments-count">
          <a
            href={`${portalUrl}/show-feedbacks?uid=${row.uid}`}
            title="Vai ai commenti"
          >
            {row.comments.length}
          </a>
        </div>
      ),
    },
  ];

  //------------ROW SELECTION------------
  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  useEffect(() => {
    setSelectedRows([]);
    setToggleCleared(!toggleCleared);
  }, [b_size]);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      // eslint-disable-next-line no-alert
      if (
        window.confirm(
          `${labels.resetFeedbacksConfirm} \n${selectedRows
            .map(r => '- ' + r.title)
            .join('\n')}`,
        )
      ) {
        setToggleCleared(!toggleCleared);

        //call delete foreach item selected
        let url = portalUrl + '/@customer-satisfaction-delete';
        let method = 'DELETE';
        let fetches = [];

        selectedRows.forEach(r => {
          fetches.push(
            apiFetch({
              url: url + '/' + r.uid,
              method: method,
            }),
          );
        });

        Promise.all(fetches).then(data => {
          handleApiResponse(data[0]);
          fetchApi();
        });
      }
    };

    return (
      <button
        key="delete"
        onClick={handleDelete}
        className="plone-btn plone-btn-danger"
      >
        {labels.resetFeedbacksButton}
      </button>
    );
  }, [data.items, selectedRows, toggleCleared]);

  //------------FILTERING-----------

  const SubHeaderComponent = React.useMemo(() => {
    const handleClearText = () => {
      setResetPaginationToggle(!resetPaginationToggle);
      const newFilters = { ...filters, text: '' };
      setFilters(newFilters);
      doQuery(newFilters);
    };

    const delayTextSubmit = value => {
      const newFilters = { ...filters, text: value };
      if (textTimeout) {
        clearInterval(textTimeout);
      }
      const timeout = setTimeout(() => {
        doQuery(newFilters);
      }, 1000);
      setFilters(newFilters);
      setTextTimeout(timeout);
    };

    const doQuery = queryFilters => {
      const params = { ...queryFilters };
      if (params.text?.length) {
        params.text = params.text + '*';
      }
      fetchApi(null, params);
    };
    return (
      <>
        <div className="search-wrapper">
          <input
            id="search"
            type="text"
            placeholder={labels.filterTitle}
            aria-label={labels.search}
            value={filters.text || ''}
            onChange={e => delayTextSubmit(e.target.value)}
          />
          <button type="button" onClick={handleClearText}>
            &times;
          </button>
        </div>
      </>
    );
  }, [filters, resetPaginationToggle, data.items, selectedRows]);

  return (
    <div className="customer-satisfaction-history-list">
      <DataTable
        columns={columns}
        data={data.items}
        keyField="uid"
        striped={true}
        highlightOnHover={true}
        pointerOnHover={false}
        noDataComponent={labels.noData}
        responsive={true}
        defaultSortFieldId={DEFAULT_SORT_ON}
        defaultSortAsc={DEFAULT_SORT_ORDER == 'ascending'}
        pagination={true}
        paginationRowsPerPageOptions={[5, 25, 50, 100]}
        paginationPerPage={b_size}
        paginationServer={true}
        paginationServerOptions={{
          persistSelectedOnPageChange: true,
          persistSelectedOnSort: false,
        }}
        paginationComponentOptions={{
          rowsPerPageText: labels.rowsPerPageText,
          rangeSeparatorText: labels.rangeSeparatorText,
        }}
        paginationTotalRows={data.items_total}
        onChangeRowsPerPage={size => setB_size(size)}
        onChangePage={handlePageChange}
        progressPending={loading}
        sortServer={true}
        onSort={(column, direction) => setSorting(column.sortField, direction)}
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={SubHeaderComponent}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        contextActions={contextActions}
        actions={true}
        clearSelectedRows={toggleCleared}
        contextMessage={{
          singular: labels.singularSelected,
          plural: labels.pluralSelected,
          message: '',
        }}
      />
    </div>
  );
};
export default CustomerSatisfactionList;
