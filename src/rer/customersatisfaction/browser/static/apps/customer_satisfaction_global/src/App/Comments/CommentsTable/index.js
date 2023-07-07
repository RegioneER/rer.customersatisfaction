import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import format from 'date-fns/format';

import { apiFetchSitesList, apiFetchCommentsBySite } from './utils/apiFetch';
import { commentsDataAggregator } from './utils/commentsDataAggregator';
import { FilterContextProvider } from './Context';
import FilterForm from './FilterForm';

const EXPORT_FILENAME = "Customer Satisfaction.csv"

const columns = [
  {
    name: 'Sito',
    selector: row => row.siteId,
    cell: row => {
      return row.siteUrl ? (
        <div className="col-title">
          <a
            href={row.siteUrl}
            title={'Apri ' + row.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.siteId}
          </a>
        </div>
      ) : (
        <div>{row.siteId}</div>
      );
    },
    sortable: true,
    sortField: 'siteId',
    csv_value: row => (row.siteId)
  },
  {
    name: 'Titolo',
    selector: row => row.contentId,
    cell: row => {
      return row.contentUrl ? (
        <div className="col-title">
          <a
            href={row.contentUrl}
            title={'Apri ' + row.contentTitle}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.contentTitle}
          </a>
        </div>
      ) : (
        <div>{row.contentTitle}</div>
      );
    },
    sortable: true,
    sortField: 'siteId',
    csv_value: row => (row.contentTitle)
  },
  {
    name: 'Voti positivi',
    selector: row => row.ok,
    id: 'ok',
    selector: row => row.ok,
    sortable: true,
    sortField: 'ok',
    width: '150px',
    csv_value: row => (row.ok)
  },
  {
    name: 'Voti negativi',
    selector: row => row.nok,
    id: 'nok',
    selector: row => row.nok,
    sortable: true,
    sortField: 'nok',
    width: '150px',
    csv_value: row => row.nok
  },
  {
    name: 'Ultimo voto',
    id: 'last_vote_date',
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
    width: '180px',
    csv_value: row => (row.last_vote)
  },
  {
    name: 'Commenti',
    selector: row => row.comments,
    sortable: true,
    sortField: 'comments',
    width: '150px',

    cell: row => (
      <div className="comments-count">
        <a
          href={`${row.siteUrl + '/show-feedbacks?uid=' + row.contentUID}`}
          title="Vai ai commenti"
        >
          {row.comments.length}
        </a>
      </div>
    ),
    csv_value: row => (row.siteUrl + '/show-feedbacks?uid=' + row.contentUID)
  },
];

function downloadCSV(array) {
  if (!array.length) {
    return;
  }
  const link = document.createElement('a');
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename = EXPORT_FILENAME;

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
}

function convertArrayOfObjectsToCSV(array) {
  let result;

  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = columns;

  result = '';

  keys.forEach(item => {
    result += item.name + columnDelimiter
  })
  result = result.slice(0, -1) + lineDelimiter;

  array.forEach(item => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter;

      result += String(key.csv_value(item)).replace(',', "").replace("#", "");
      // eslint-disable-next-line no-plusplus
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export</Button>;

const CommentsTable = () => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([])

  // adding new filters always mantain defined structure
  const [filters, setFilters] = useState({ siteId: { value: null, possibleValues: [] } });

  // const filteredItems = data.filter(
  // 	item => item.name && item.name.toLowerCase().includes(fileter.toLowerCase()),
  // );

  // Csv export
  const actionsMemo = <Export onExport={() => downloadCSV(filteredData)} />

  useEffect(() => {
    let data = [];

    apiFetchSitesList().then((result) => {
      Promise.all(
        result.data && result.data.map(
          site => apiFetchCommentsBySite(site.id)
            .then(result => {
              result.data.siteId = site.id;
              result.data.siteUrl = site.url;
              data = [...data, result.data];
            }, error => console.log(error))
        )
      ).then(
        () => commentsDataAggregator(data).then(result => setAggregatedData(result))
      );
    }, error => console.log(error));
  }, []);

  useEffect(() => {
    // filter data by filters
    let result = [];
    aggregatedData.forEach(item => {
      for (const [filter_key, filter_value] of Object.entries(filters)) {
        if (filter_value && filter_value.value) {
          if (item[filter_key]) {
            if (!(item[filter_key] === filter_value.value)) {
              return;
            }
          } else {
            return;
          }
        }
      }
      result.push(item);
    });

    setFilteredData(result);

  }, [filters, aggregatedData]);

  useEffect(() => {
    setFilters(
      (oldFilters) => {
        return { ...oldFilters, siteId: { ...oldFilters.siteId, possibleValues: aggregatedData && [...new Set(aggregatedData.map(item => item.siteId))] } }
      }
    )
  }, [aggregatedData]);

  return (
    <>
      <FilterContextProvider value={{ filters: filters, setFilters: setFilters }}>
        <FilterForm />
      </FilterContextProvider>
      {filteredData.length ?
        <DataTable
          columns={columns}
          data={filteredData}
          defaultSortAsc={false}
          defaultSortFieldId="last_vote_date"
          actions={actionsMemo}
        />
        :
        <Box sx={{ display: 'flex', "justify-content": "center", "padding-top": "2em" }}>
          <CircularProgress />
        </Box >
      }
    </>
  )
}

export default CommentsTable;
