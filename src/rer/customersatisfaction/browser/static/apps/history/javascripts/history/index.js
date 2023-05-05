import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const rootElement = document.getElementById(
  'customer-satisfaction-history-wrapper',
);

ReactDOM.render(
  <App canDelete={JSON.parse(rootElement.dataset.candelete)} />,
  rootElement,
);
