import Header from './components/layout/Header';
import { Spinner } from 'flowbite-react';
import { Outlet, useLocation } from 'react-router-dom';
import AppStoreProvider from './state/AppStoreProvider';
import styled from 'styled-components';
import tw, { theme } from 'twin.macro';
import { useAppInitialData, useObservationRefresh } from './services/app-data/app-data-service';
import { defaultState } from './state/defaultState';
import { useMemo } from 'react';

const Main = styled.main`
  min-height: calc(100vh - ${theme`spacing.24`});
  ${tw`bg-gray-50 flex flex-col gap-5 pt-6 px-8 overflow-visible pb-24 animate-in fade-in-0 slide-in-from-bottom-1 duration-1200`}
`;

const AppWithStore: ReactFC = ({ children }) => {
  useObservationRefresh();

  return children;
};

const App: ReactFC = () => {
  const { loading, appState } = useAppInitialData();
  const { pathname } = useLocation();

  const initialState = useMemo(() => ({ ...defaultState, ...appState }), [appState]);

  return (
    <>
      {!loading ? (
        <AppStoreProvider initialState={initialState!}>
          <AppWithStore>
            <Header />
            <Main key={pathname}>
              <Outlet />
            </Main>
          </AppWithStore>
        </AppStoreProvider>
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      )}
    </>
  );
};

export default App;
