import { createContext, useCallback, useMemo, useState } from 'react';
import { Observation, Alert } from './models';
import { Dictionary, chain, kebabCase } from 'lodash';

export interface AppState {
  // Dashboard
  region: string;
  filterFrom: Date | null;
  filterTo: Date | null;
  filterSpecies: string[];
  filterSource: string | null;
  invasiveOnly: boolean;
  observations: Observation[];
  // Alerts
  alerts: Alert[];
}

export interface ComputedAppState {
  regions: string[];
  filteredObservations: Observation[];
  filteredInvasiveObservations: Observation[];
  filteredAlerts: Alert[];
  groupedObservations: Dictionary<Observation[]>;
  alertsCount: number;
  species: string[];
  sources: string[];
}

type AppStore = AppState & {
  setState: (state: Partial<AppState>) => void;
  computed: ComputedAppState;
};

const defaultState = (): AppStore => ({
  region: '',
  filterFrom: null,
  filterTo: null,
  filterSpecies: [],
  filterSource: null,
  invasiveOnly: false,
  alerts: [],
  observations: [],
  setState: () => {},
  computed: {
    filteredObservations: [],
    filteredInvasiveObservations: [],
    filteredAlerts: [],
    groupedObservations: {},
    regions: [],
    alertsCount: 0,
    species: [],
    sources: []
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
        .filter(x => !appState.invasiveOnly || x.isInvasive)
        .filter(x => x.location === appState.region)
        .filter(x => appState.filterSpecies.length == 0 || appState.filterSpecies.includes(x.speciesName))
        .filter(x => !appState.filterSource || appState.filterSource == x.source),
      filteredInvasiveObservations: chain(appState.observations)
        .filter(x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date()))
        .filter(x => x.isInvasive)
        .filter(x => x.location === appState.region)
        .filter(x => appState.filterSpecies.length == 0 || appState.filterSpecies.includes(x.speciesName))
        .filter(x => !appState.filterSource || appState.filterSource == x.source)
        .orderBy(x => x.date, 'desc')
        .value(),
      filteredAlerts: chain(appState.alerts)
        .filter(x => x.locations === appState.region)
        .orderBy(x => x.date, 'desc')
        .value(),

      // Grouping of observations for map component
      groupedObservations: chain(appState.observations)
        .filter(x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date()))
        .filter(x => !appState.invasiveOnly || x.isInvasive)
        .filter(x => x.location === appState.region)
        .filter(x => appState.filterSpecies.length == 0 || appState.filterSpecies.includes(x.speciesName))
        .filter(x => !appState.filterSource || appState.filterSource == x.source)
        .groupBy(obs => {
          return `${kebabCase(obs.speciesName)}-${Math.round(obs.geoLocation?.latitude * 1000) / 1000}-${
            Math.round(obs.geoLocation?.longitude * 1000) / 1000
          }`;
        })
        .value(),
      regions: chain(appState.observations)
        .map(x => x.location)
        .uniq()
        .value(),
      alertsCount: chain(appState.alerts)
        .filter(x => x.locations === appState.region)
        .value().length,
      species: chain(appState.observations)
        .filter(x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date()))
        .filter(x => x.location === appState.region)
        .map(x => x.speciesName)
        .uniq()
        .sort()
        .value(),
      sources: chain(appState.observations)
        .filter(x => x.date >= (appState.filterFrom ?? new Date()) && x.date <= (appState.filterTo ?? new Date()))
        .filter(x => x.location === appState.region)
        .map(x => x.source)
        .uniq()
        .sort()
        .value()
    }),
    [appState]
  );

  const value = useMemo(() => ({ ...appState, setState, computed }), [appState, computed, setState]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export default AppStoreProvider;
