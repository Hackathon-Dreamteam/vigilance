import { createContext, useCallback, useMemo, useState } from 'react';

export interface AppState {
  region: string;
  regions: string[];
  filterFrom: Date | null;
  filterTo: Date | null;
  showInvasive: boolean;
  setState: (state: Partial<AppState>) => void;
}

const defaultState = (): AppState => ({
  region: '',
  regions: [],
  filterFrom: null,
  filterTo: null,
  showInvasive: false,
  setState: () => {}
});

export const AppStateContext = createContext<AppState>(defaultState());

const AppStateProvider: ReactFC<{ state: Partial<AppState> }> = ({ children, state }) => {
  const [appState, setAppState] = useState({ ...defaultState(), ...state });

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
