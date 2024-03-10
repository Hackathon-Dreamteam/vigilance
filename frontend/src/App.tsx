import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import { defaultState } from './state/defaultState';
import { ApiHttpService } from './services/http/http-service';
import { Observation } from './state/models';
import { merge } from 'lodash';
import { Spinner } from 'flowbite-react';
import { useMinimumLoading } from './hooks/useMinimumLoading';
import { Outlet } from 'react-router-dom';
import AppStoreProvider, { AppState } from './state/AppStoreProvider';
import styled from 'styled-components';
import tw, { theme } from 'twin.macro';

const useFetchAppData = () => {
  const [appState, setAppState] = useState<AppState>();
  const loading = useMinimumLoading(!!appState, 500);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { response: observations } = await ApiHttpService.get<Observation[]>('/observations');

    const state: Partial<AppState> = {
      observations: observations?.map(x => ({ ...x, location: x.location === 'Montreal' ? 'Montréal' : x.location }))
    };

    setAppState(merge(state, defaultState) as AppState);
  };

  return { loading, appState };
};

const Main = styled.main`
  min-height: calc(100vh - ${theme`spacing.24`});
  ${tw`bg-gray-50 flex flex-col gap-5 pt-6 px-8 overflow-hidden pb-24`}
`;

const App: ReactFC = () => {
  const { loading, appState } = useFetchAppData();

  return (
    <>
      {!loading ? (
        <AppStoreProvider state={appState!}>
          <Header />
          <Main>
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
