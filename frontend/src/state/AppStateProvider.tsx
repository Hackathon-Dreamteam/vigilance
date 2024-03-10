import { createContext, useCallback, useMemo, useState } from 'react';

interface AppState {
  region: string;
  regions: string[];
  setState: (state: Partial<AppState>) => void;
}

const defaultState = (): AppState => ({
  region: '',
  regions: [],
  setState: () => {}
});

const defaultStateDev: AppState = {
  ...defaultState(),
  region: 'Laval',
  regions: ['Laval', 'Montréal', 'Shawinigan']
};

export const AppStateContext = createContext<AppState>(defaultState());

const AppStateProvider: ReactFC = ({ children }) => {
  const [appState, setAppState] = useState(defaultStateDev);

  const setState = useCallback(
    (state: Partial<AppState>) => {
      setAppState({ ...appState, ...state });
    },
    [appState]
  );

  const value = useMemo(() => ({ ...appState, setState }), [appState, setState]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateProvider;
