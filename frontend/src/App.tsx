import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import AppStateProvider, { AppState } from './state/AppStateProvider';
import { defaultState } from './state/defaultState';
import { ApiHttpService } from './services/http/http-service';
import { Observation } from './state/models';
import { merge } from 'lodash';
import { Spinner } from 'flowbite-react';
import { useMinimumLoading } from './hooks/useMinimumLoading';
import { Outlet } from 'react-router-dom';

const App: ReactFC = () => {
  const [appState, setAppState] = useState<AppState>();
  const loading = useMinimumLoading(!!appState, 500);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { response: observations } = await ApiHttpService.get<Observation[]>('/observations');

    const state: Partial<AppState> = {
      observations
    };

    setAppState(merge(state, defaultState) as AppState);
  };

  return (
    <>
      {!loading ? (
        <AppStateProvider state={appState!}>
          <Header />
          <Outlet />
        </AppStateProvider>
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      )}
    </>
  );
};

export default App;
