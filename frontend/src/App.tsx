import { useCallback, useEffect, useState } from 'react';
import Header from './components/layout/Header';
import { defaultState } from './state/defaultState';
import { ApiHttpService } from './services/http/http-service';
import { Alert, Observation } from './state/models';
import { merge } from 'lodash';
import { Spinner } from 'flowbite-react';
import { useMinimumLoading } from './hooks/useMinimumLoading';
import { Outlet, useLocation } from 'react-router-dom';
import AppStoreProvider, { AppState } from './state/AppStoreProvider';
import styled from 'styled-components';
import tw, { theme } from 'twin.macro';

const toTitleCase = str => {
  return str.replace(/[^\s]+/g, word => {
    return word.replace(/^./, first => {
      return first.toUpperCase();
    });
  });
};

const useFetchAppData = () => {
  const [appState, setAppState] = useState<AppState>();
  const loading = useMinimumLoading(!!appState, 500);

  const fetchData = useCallback(async () => {
    const observationsPromise = ApiHttpService.get<Observation[]>('/observations');
    const alertsPromise = ApiHttpService.get<Alert[]>('/alerts');

    const [{ response: observations }, { response: alerts }] = await Promise.all([observationsPromise, alertsPromise]);

    // Clean data
    const state: Partial<AppState> = {
      observations: observations?.map(x => ({
        ...x,
        // Fix casing (note: lodash startCase break diacritics)
        speciesName: toTitleCase(x.speciesName),
        location: x.location === 'Montreal' ? 'Montréal' : x.location,
        source: x.source === 'Community' ? 'iNaturalist' : x.source == 'Government' ? 'Sentinelle' : x.source
      })),
      alerts: alerts?.map(x => ({
        ...x,
        speciesName: toTitleCase(x.speciesName),
        locations: x.locations === 'Montreal' ? 'Montréal' : x.locations
      }))
    };

    setAppState(merge(state, defaultState) as AppState);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, appState };
};

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
