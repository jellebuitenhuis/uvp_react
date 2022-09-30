import './index.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import reportWebVitals from './reportWebVitals.js';
import App from "./App";
import ReactDOM from 'react-dom';
import React from 'react';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
reportWebVitals();
