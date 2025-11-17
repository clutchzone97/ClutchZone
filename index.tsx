// E:\97\index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SiteSettingsProvider>
      <App />
    </SiteSettingsProvider>
  </React.StrictMode>
);
