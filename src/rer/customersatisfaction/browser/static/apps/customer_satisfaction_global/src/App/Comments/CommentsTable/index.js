import { useState, useEffect} from "react";
import DataTable from 'react-data-table-component';
import format from 'date-fns/format';

import {apiFetchSitesList, apiFetchCommentsBySite} from './utils/apiFetch';
import {commentsDataAggregator} from './utils/commentsDataAggregator';
import {FilterContextProvider} from './Context';
import FilterForm from './FilterForm';


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
  },
    {
      name: 'Voti positivi',
      selector: row => row.ok,
      id: 'ok',
      selector: row => row.ok,
      sortable: true,
      sortField: 'ok',
      width: '150px',
  },
    {
        name: 'Voti negativi',
        selector: row => row.nok,
        id: 'nok',
        selector: row => row.nok,
        sortable: true,
        sortField: 'nok',
        width: '150px',
    },
    {
      name: 'Ultimo voto',
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
    },
];

const CommentsTable = () => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([])

  // adding new filters always mantain defined structure
  const [filters, setFilters] = useState({siteId: {value: null, possibleValues: []}});
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // const filteredItems = data.filter(
	// 	item => item.name && item.name.toLowerCase().includes(fileter.toLowerCase()),
	// );

  useEffect(() => {
      let data = [];

      apiFetchSitesList().then((result) => {
        Promise.all(
          result.data && result.data.map(
            site => apiFetchCommentsBySite(site.id)
              .then(result =>  {
                result.data.siteId = site.id;
                result.data.siteUrl = site.url;
                data = [...data, result.data];
              }, error => console.log(error))
            )
        ).then(
          () => commentsDataAggregator(data).then(result => setAggregatedData(result))
        );

        setFilters(
          (oldFilters) => {
            return {...oldFilters, siteId: {...oldFilters.siteId, possibleValues: result.data && result.data.map(item => item.id)}}
          }
        )
      }, error => console.log(error));
  }, []);

  useEffect(() => {
    // filter data by filters
    let result = [];

    aggregatedData.forEach(item => {
        for (const [filter_key, filter_value] of Object.entries(filters)){
          if (filter_value && filter_value.value) {
            if (item[filter_key]){
                if(!(item[filter_key] === filter_value.value)){
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

  return (
    <>
      <FilterContextProvider value={{filters: filters, setFilters: setFilters}}>
        <FilterForm/>
      </FilterContextProvider>
      <DataTable
        columns={columns}
        data={filteredData}
      />
    </>
  )
}

export default CommentsTable;
