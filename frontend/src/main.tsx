import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import GlobalStyles from './styles/GlobalStyles.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import AlertPage from './pages/alert/AlertPage.tsx';
import './styles/main.css';
import LoginPage from './pages/login/LoginPage.tsx';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { fr } from 'date-fns/locale/fr';

setDefaultOptions({ locale: fr });

const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
    errorElement: <div>Error!</div>
  },
  {
    path: '/dashboard',
    Component: DashboardPage
  },
  {
    path: '/alerts',
    Component: AlertPage
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyles />
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
