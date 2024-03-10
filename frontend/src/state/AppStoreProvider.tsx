import { createContext, useCallback, useMemo, useState } from 'react';
import { Observation } from './models';
import { chain } from 'lodash';

export interface AppState {
  // Dashboard
  region: string;
  filterFrom: Date | null;
  filterTo: Date | null;
  showInvasive: boolean;
  observations: Observation[];
  // Alerts
  alertsCount: number | null;
}

export interface ComputedAppState {
  regions: string[];
  filteredObservations: Observation[];
  filteredInvasiveObservations: Observation[];
}

type AppStore = AppState & {
  setState: (state: Partial<AppState>) => void;
  computed: ComputedAppState;
};

const defaultState = (): AppStore => ({
  region: '',
  filterFrom: null,
  filterTo: null,
  showInvasive: false,
  alertsCount: null,
  observations: [],
  setState: () => {},
  computed: {
    filteredObservations: [],
    filteredInvasiveObservations: [],
    regions: []
  }
});

export const AppStoreContext = createContext<AppStore>(defaultState());

const AppStoreProvider: ReactFC<{ state: Partial<AppState> }> = ({ children, state }) => {
  const [appState, setAppState] = useState<AppStore>({ ...defaultState(), ...state });

  const setState = useCallback(
    (state: Partial<AppState>) => {
      setAppState({ ...appState, ...state });
    },
    [appState]
  );

  const computed = useMemo(
    (): ComputedAppState => ({
      filteredObservations: appState.observations
        .filter(x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date()))
        .filter(x => x.isInvasive || !appState.showInvasive)
        .filter(x => x.location === appState.region),
      filteredInvasiveObservations: chain(appState.observations)
        .filter(x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date()))
        .filter(x => x.isInvasive)
        .filter(x => x.location === appState.region)
        .orderBy(x => x.date, 'desc')
        .value(),
      regions: chain(appState.observations)
        .map(x => x.location)
        .uniq()
        .value()
    }),
    [appState]
  );

  const value = useMemo(() => ({ ...appState, setState, computed }), [appState, computed, setState]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export default AppStoreProvider;
