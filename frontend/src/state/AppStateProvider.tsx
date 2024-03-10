import { createContext, useCallback, useMemo, useState } from 'react';
import { Observation } from './models';

export interface ComputedAppState {
  filteredObservations: Observation[];
}

export interface AppState {
  // Dashboard
  region: string;
  regions: string[];
  filterFrom: Date | null;
  filterTo: Date | null;
  showInvasive: boolean;
  observations: Observation[];
  // Alerts
  alertsCount: number | null;

  setState: (state: Partial<AppState>) => void;
  computed: ComputedAppState;
}

const defaultState = (): AppState => ({
  region: '',
  regions: [],
  filterFrom: null,
  filterTo: null,
  showInvasive: false,
  alertsCount: null,
  observations: [],
  setState: () => {},
  computed: {
    filteredObservations: []
  }
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

  const computed = useMemo(
    (): ComputedAppState => ({
      filteredObservations: appState.observations.filter(
        x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date())
      )
    }),
    [appState]
  );

  const value = useMemo(() => ({ ...appState, setState, computed }), [appState, computed, setState]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateProvider;
