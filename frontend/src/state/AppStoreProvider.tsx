import { createContext, useCallback, useMemo, useState } from 'react';
import { Observation, Alert, RealTimeObservation } from './models';
import { chain } from 'lodash';

export interface AppState {
  // App
  region: string;
  // Dashboard
  filterFrom: Date | null;
  filterTo: Date | null;
  filterSpecies: string[];
  filterSource: string | null;
  invasiveOnly: boolean;
  // Observations
  observations: Observation[];
  realTimeObservations: RealTimeObservation[];
  // Alerts
  alerts: Alert[];
}

export interface ComputedAppState {
  regions: string[];
  filteredObservations: Observation[];
  filteredInvasiveObservations: Observation[];
  filteredAlerts: Alert[];
  filteredSpecies: string[];
  species: string[];
  sources: string[];
}

type AppStore = AppState & {
  setState: (state: Partial<AppState>) => void;
  computed: ComputedAppState;
};

const defaultStore = (): AppStore => ({
  region: '',
  filterFrom: null,
  filterTo: null,
  filterSpecies: [],
  filterSource: null,
  invasiveOnly: false,
  alerts: [],
  observations: [],
  realTimeObservations: [],
  setState: () => {},
  computed: {
    filteredObservations: [],
    filteredInvasiveObservations: [],
    filteredAlerts: [],
    filteredSpecies: [],
    regions: [],
    species: [],
    sources: []
  }
});

export const AppStoreContext = createContext<AppStore>(defaultStore());

const AppStoreProvider: ReactFC<{ initialState: Partial<AppState> }> = ({ children, initialState }) => {
  const [appState, setAppState] = useState<AppStore>({ ...defaultStore(), ...initialState });

  const setState = useCallback(
    (state: Partial<AppState>) => {
      setAppState({ ...appState, ...state });
    },
    [appState]
  );

  const computed = useMemo((): ComputedAppState => {
    const observations = chain(appState.observations)
      .filter(x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date()))
      .filter(x => x.location === appState.region);

    const filteredObservations = observations
      .filter(x => appState.filterSpecies.length == 0 || appState.filterSpecies.includes(x.speciesName))
      .filter(x => !appState.filterSource || appState.filterSource == x.source)
      .orderBy(x => x.date, 'desc');

    return {
      filteredObservations: filteredObservations.filter(x => !appState.invasiveOnly || x.isInvasive).value(),
      filteredInvasiveObservations: filteredObservations.filter(x => x.isInvasive).value(),
      filteredAlerts: chain(appState.alerts)
        .filter(x => x.locations === appState.region)
        .orderBy(x => x.date, 'desc')
        .value(),
      filteredSpecies: chain(appState.observations)
        .filter(x => x.location === appState.region)
        .map(x => x.speciesName)
        .uniq()
        .sort()
        .value(),
      regions: chain(appState.observations)
        .map(x => x.location)
        .uniq()
        .sort()
        .value(),
      species: observations
        .map(x => x.speciesName)
        .uniq()
        .sort()
        .value(),
      sources: observations
        .map(x => x.source)
        .uniq()
        .sort()
        .value()
    };
  }, [appState]);

  const value = useMemo(() => ({ ...appState, setState, computed }), [appState, computed, setState]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export default AppStoreProvider;
