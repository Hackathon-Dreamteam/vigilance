import { createContext, useCallback, useMemo, useState } from 'react';

interface AppState {
  region: string;
  setState: (state: Partial<AppState>) => void;
}

const defaultState = (): AppState => ({
  region: 'Laval',
  setState: () => {}
});

export const AppStateContext = createContext<AppState>(defaultState());

const AppStateProvider: ReactFC = ({ children }) => {
  const [appState, setAppState] = useState(defaultState());

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
