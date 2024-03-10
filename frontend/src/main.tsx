import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import GlobalStyles from './styles/GlobalStyles.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import './styles/main.css';
import AppStateProvider from './state/AppStateProvider.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    errorElement: <div>Error!</div>
  },
  {
    path: '/dashboard',
    Component: DashboardPage
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStateProvider>
      <GlobalStyles />
      <RouterProvider router={router} />
    </AppStateProvider>
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
