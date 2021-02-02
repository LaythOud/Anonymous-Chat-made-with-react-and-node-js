import React from 'react';
import ReactDOM from 'react-dom';
import './Style/index.css';
import App from './App';
import reportWebVitals from './Test/reportWebVitals';
import { SocketProvider } from './Provider/SocketProvider'
import ErrorBoundary from './Component/ErrorBoundary'
import {PeerProvider} from './Provider/PeerProvider'

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <SocketProvider >
      <PeerProvider>
        <App />
      </PeerProvider>
      </SocketProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
