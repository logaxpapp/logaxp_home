// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/globals.css';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { ToastProvider } from './features/Toast/ToastContext';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router> {/* Wrap App in Router */}
          <ToastProvider>
            <App />
          </ToastProvider>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
