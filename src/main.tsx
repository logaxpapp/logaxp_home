// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/globals.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
//import { ThemeProvider } from './utils/themes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
     
        <App />
      
    </Provider>
  </React.StrictMode>
);
