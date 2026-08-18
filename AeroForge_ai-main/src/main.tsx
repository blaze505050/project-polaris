import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './components/Router';
import { useThemeStore } from './stores/themeStore';
import './styles/global.css';

// Initialize theme before render to prevent flash
useThemeStore.getState().initTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

