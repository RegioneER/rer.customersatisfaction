webpackHotUpdate("history",{

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.jsx":
/*!******************************************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.jsx ***!
  \******************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_data_table_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-data-table-component */ "./node_modules/react-data-table-component/dist/index.cjs.js");
/* harmony import */ var react_data_table_component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_data_table_component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var date_fns_format__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns/format */ "./node_modules/date-fns/esm/format/index.js");
/* harmony import */ var _TranslationsContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../TranslationsContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/TranslationsContext.js");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var _ApiContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../ApiContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/ApiContext.js");
/* harmony import */ var _utils_apiFetch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/apiFetch */ "./src/rer/customersatisfaction/browser/static/react/javascripts/utils/apiFetch.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/utils.js");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index.less */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.less");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_8__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var CustomerSatisfactionList = function CustomerSatisfactionList() {
  var getTranslationFor = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_TranslationsContext__WEBPACK_IMPORTED_MODULE_3__["TranslationsContext"]);

  var _useContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_ApiContext__WEBPACK_IMPORTED_MODULE_5__["ApiContext"]),
      data = _useContext.data,
      portalUrl = _useContext.portalUrl,
      fetchApi = _useContext.fetchApi,
      loading = _useContext.loading,
      handleApiResponse = _useContext.handleApiResponse,
      setB_size = _useContext.setB_size,
      handlePageChange = _useContext.handlePageChange,
      b_size = _useContext.b_size,
      setSorting = _useContext.setSorting;

  var labels = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["getCustomerSatisfactionLables"])(getTranslationFor);

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState2 = _slicedToArray(_useState, 2),
      filters = _useState2[0],
      setFilters = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(0),
      _useState4 = _slicedToArray(_useState3, 2),
      textTimeout = _useState4[0],
      setTextTimeout = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState6 = _slicedToArray(_useState5, 2),
      resetPaginationToggle = _useState6[0],
      setResetPaginationToggle = _useState6[1];

  var _React$useState = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selectedRows = _React$useState2[0],
      setSelectedRows = _React$useState2[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState8 = _slicedToArray(_useState7, 2),
      toggleCleared = _useState8[0],
      setToggleCleared = _useState8[1]; //------------------COLUMNS----------------------


  var columns = [{
    name: labels.page,
    selector: 'title',
    sortable: true,
    cell: function cell(row) {
      return row.url ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: row.url,
        title: row.title
      }, row.title)) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, row.title);
    }
  }, {
    name: labels.ok,
    selector: 'ok',
    sortable: true,
    width: '120px'
  }, {
    name: labels.nok,
    selector: 'nok',
    sortable: true,
    width: '120px'
  }, {
    name: labels.last_voted,
    selector: 'last_vote',
    sortable: true,
    cell: function cell(row) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, row.last_vote ? Object(date_fns_format__WEBPACK_IMPORTED_MODULE_2__["default"])(new Date(row.last_vote), 'dd/MM/yyyy HH:mm:ss') : '');
    },
    width: '160px'
  }, {
    name: labels.comments,
    selector: 'comments',
    sortable: false,
    width: '80px',
    cell: function cell(row) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "".concat(row.url, "/show-feedbacks")
      }, row.comments.length));
    }
  }]; //------------ROW SELECTION------------

  var handleRowSelected = react__WEBPACK_IMPORTED_MODULE_0___default.a.useCallback(function (state) {
    setSelectedRows(state.selectedRows);
  }, []);
  var contextActions = react__WEBPACK_IMPORTED_MODULE_0___default.a.useMemo(function () {
    var handleDelete = function handleDelete() {
      // eslint-disable-next-line no-alert
      if (window.confirm("".concat(labels.resetFeedbacksConfirm, " \n").concat(selectedRows.map(function (r) {
        return r.title;
      }).join('\n')))) {
        setToggleCleared(!toggleCleared); //call delete foreach item selected

        var url = portalUrl + '/@customer-satisfaction-delete';
        var method = 'DELETE';
        var fetches = [];
        selectedRows.forEach(function (r) {
          fetches.push(Object(_utils_apiFetch__WEBPACK_IMPORTED_MODULE_6__["default"])({
            url: url + '/' + r.uid,
            method: method
          }));
        });
        Promise.all(fetches).then(function (data) {
          handleApiResponse(data[0]);
          fetchApi();
        });
      }
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      key: "delete",
      onClick: handleDelete,
      className: "plone-btn plone-btn-danger"
    }, labels.resetFeedbacksButton);
  }, [data.items, selectedRows, toggleCleared]); //------------FILTERING-----------

  var SubHeaderComponent = react__WEBPACK_IMPORTED_MODULE_0___default.a.useMemo(function () {
    var handleClearText = function handleClearText() {
      setResetPaginationToggle(!resetPaginationToggle);

      var newFilters = _objectSpread(_objectSpread({}, filters), {}, {
        text: ''
      });

      setFilters(newFilters);
      doQuery(newFilters);
    };

    var delayTextSubmit = function delayTextSubmit(value) {
      var newFilters = _objectSpread(_objectSpread({}, filters), {}, {
        text: value
      });

      if (textTimeout) {
        clearInterval(textTimeout);
      }

      var timeout = setTimeout(function () {
        doQuery(newFilters);
      }, 1000);
      setFilters(newFilters);
      setTextTimeout(timeout);
    };

    var doQuery = function doQuery(queryFilters) {
      var _params$text;

      var params = _objectSpread({}, queryFilters);

      if ((_params$text = params.text) !== null && _params$text !== void 0 && _params$text.length) {
        params.text = params.text + '*';
      }

      fetchApi(null, params);
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "search-wrapper"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      id: "search",
      type: "text",
      placeholder: labels.filterTitle,
      "aria-label": labels.search,
      value: filters.text || '',
      onChange: function onChange(e) {
        return delayTextSubmit(e.target.value);
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      type: "button",
      onClick: handleClearText
    }, "X")));
  }, [filters, resetPaginationToggle, data.items]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "customer-satisfaction-history-list"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_data_table_component__WEBPACK_IMPORTED_MODULE_1___default.a, {
    columns: columns,
    data: data.items,
    striped: true,
    highlightOnHover: true,
    pointerOnHover: false,
    noDataComponent: labels.noData,
    responsive: true,
    defaultSortField: _ApiContext__WEBPACK_IMPORTED_MODULE_5__["DEFAULT_SORT_ON"],
    defaultSortAsc: _ApiContext__WEBPACK_IMPORTED_MODULE_5__["DEFAULT_SORT_ORDER"] == 'ascending',
    pagination: true,
    paginationRowsPerPageOptions: [5, 25, 50, 100],
    paginationPerPage: b_size,
    paginationServer: true,
    paginationServerOptions: {
      persistSelectedOnPageChange: true,
      persistSelectedOnSort: false
    },
    paginationTotalRows: data.items_total,
    onChangeRowsPerPage: function onChangeRowsPerPage(size) {
      return setB_size(size);
    },
    onChangePage: handlePageChange,
    progressPending: loading,
    sortServer: true,
    onSort: function onSort(column, direction) {
      return setSorting(column.selector, direction);
    },
    paginationResetDefaultPage: resetPaginationToggle // optionally, a hook to reset pagination to page 1
    ,
    subHeader: true,
    subHeaderComponent: SubHeaderComponent,
    selectableRows: true,
    onSelectedRowsChange: handleRowSelected,
    contextActions: contextActions,
    clearSelectedRows: toggleCleared,
    contextMessage: {
      singular: labels.singularSelected,
      plural: labels.pluralSelected,
      message: ''
    }
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (CustomerSatisfactionList);

/***/ })

})
//# sourceMappingURL=history.c1251627fa7d7d566b4d.hot-update.js.map