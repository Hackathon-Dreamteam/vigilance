import { useCallback, useEffect, useRef, useState } from 'react';
import { useMinimumLoading } from '../../hooks/useMinimumLoading';
import { chain } from 'lodash';
import { AppState } from '../../state/AppStoreProvider';
import { Alert, Observation, RealTimeObservation } from '../../state/models';
import { toTitleCase } from '../../utils/string';
import { ApiHttpService } from '../http/http-service';
import { useAppStore } from '../../state/useAppStore';

export const useAppInitialData = () => {
  const [appState, setAppState] = useState<Partial<AppState>>();
  const loading = useMinimumLoading(!!appState, 500);

  const fetchData = useCallback(async () => {
    const observationsPromise = ApiHttpService.get<Observation[]>('/observations');
    const alertsPromise = ApiHttpService.get<Alert[]>('/alerts');

    const [{ response: observations }, { response: alerts }] = await Promise.all([observationsPromise, alertsPromise]);

    // Clean data
    const state: Partial<AppState> = {
      observations: chain(observations ?? [])
        .filter(x => !!x.speciesName)
        .filter(x => !!x.observationId)
        .map(x => ({
          ...x,
          // Fix casing (note: lodash startCase break diacritics)
          speciesName: toTitleCase(x.speciesName),
          location: x.location === 'Montreal' ? 'Montréal' : x.location,
          source: x.source === 'Community' ? 'iNaturalist' : x.source == 'Government' ? 'Sentinelle' : x.source
        }))
        .value(),
      alerts: chain(alerts)
        .filter(x => !!x.speciesName)
        .filter(x => !!x.id)
        .map(x => ({
          ...x,
          speciesName: toTitleCase(x.speciesName),
          locations: x.locations === 'Montreal' ? 'Montréal' : x.locations
        }))
        .value()
    };

    setAppState(state);
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, appState };
};

const mergeLatestObservations = (observations?: Observation[], latestObservations?: Observation[]) => {
  return chain<Observation>((latestObservations ?? []).map(x => ({ ...x, isRealTime: true } as RealTimeObservation)))
    .concat(observations ?? [])
    .uniqBy(x => x.observationId)
    .value();
};

export const useObservationRefresh = () => {
  const { setState, observations } = useAppStore();
  const initialFetch = useRef(false);

  const refreshObservations = useCallback(async () => {
    const { response: latestObservations } = await ApiHttpService.get<Observation[]>('/observations/latest');

    setState({ observations: mergeLatestObservations(observations, latestObservations) });
  }, [observations, setState]);

  // Initial fetch
  useEffect(() => {
    if (observations.length > 0 && !initialFetch.current) {
      initialFetch.current = true;

      setTimeout(() => {
        refreshObservations();
      }, 2000);
    }
  }, [observations.length, refreshObservations]);

  // Fetch latest observations
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshObservations();
    }, import.meta.env.VITE_REFRESH_OBSERVATIONS_INTERVAL);

    return () => clearInterval(intervalId);
  }, [refreshObservations]);
};
