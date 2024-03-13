import Header from './components/layout/Header';
import { Spinner } from 'flowbite-react';
import { Outlet, useLocation } from 'react-router-dom';
import AppStoreProvider from './state/AppStoreProvider';
import styled from 'styled-components';
import tw, { theme } from 'twin.macro';
import { useFetchAppData } from './services/app-data/app-data-service';

const Main = styled.main`
  min-height: calc(100vh - ${theme`spacing.24`});
  ${tw`bg-gray-50 flex flex-col gap-5 pt-6 px-8 overflow-hidden pb-24 animate-in fade-in-0 slide-in-from-bottom-1 duration-1200`}
`;

const App: ReactFC = () => {
  const { loading, appState } = useFetchAppData();
  const { pathname } = useLocation();

  return (
    <>
      {!loading ? (
        <AppStoreProvider state={appState!}>
          <Header />
          <Main key={pathname}>
            <Outlet />
          </Main>
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
