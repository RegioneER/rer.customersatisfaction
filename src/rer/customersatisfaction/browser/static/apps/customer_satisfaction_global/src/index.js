import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Handling backward compatibility with redundant version of webpack used in our buildout
window.React = React;

const root = ReactDOM.createRoot(document.getElementById('root'));

document.querySelector('body').setAttribute('data-portal-url', 'localhost:8080/');

root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
