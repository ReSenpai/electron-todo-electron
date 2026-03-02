import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './app/global.css';
import { store } from './app/store';
import { ThemeProvider, useTheme } from './app/ThemeContext';
import App from './app/App';

function Root() {
  const { appearance } = useTheme();

  return (
    <Theme appearance={appearance} accentColor="green" radius="medium">
      <App />
    </Theme>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
