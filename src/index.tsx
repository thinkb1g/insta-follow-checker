import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { initGA, logPageView } from "./analytics";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

initGA(); // GA 초기화
logPageView(window.location.pathname + window.location.search);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
8