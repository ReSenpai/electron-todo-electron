import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './app/global.css';
import { store } from './app/store';
import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme appearance="dark" accentColor="blue" radius="medium">
        <App />
      </Theme>
    </Provider>
  </React.StrictMode>,
);
