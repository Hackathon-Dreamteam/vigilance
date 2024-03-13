import { useCallback, useEffect, useState } from 'react';
import { useMinimumLoading } from '../../hooks/useMinimumLoading';
import { chain, merge } from 'lodash';
import { AppState } from '../../state/AppStoreProvider';
import { defaultState } from '../../state/defaultState';
import { Alert, Observation } from '../../state/models';
import { toTitleCase } from '../../utils/string';
import { ApiHttpService } from '../http/http-service';

export const useFetchAppData = () => {
  const [appState, setAppState] = useState<AppState>();
  const loading = useMinimumLoading(!!appState, 500);

  const refreshObservations = useCallback(async () => {
    const { response: latestObservations } = await ApiHttpService.get<Observation[]>('/observations/latest');

    const observations = chain(appState?.observations ?? [])
      .concat(latestObservations ?? [])
      .uniqBy(x => x.observationId)
      .value();

    setAppState(merge({ observations }, appState) as AppState);
  }, [appState]);

  const fetchData = useCallback(async () => {
    const observationsPromise = ApiHttpService.get<Observation[]>('/observations');
    const latestObservationsPromise = ApiHttpService.get<Observation[]>('/observations/latest');
    const alertsPromise = ApiHttpService.get<Alert[]>('/alerts');

    const [{ response: observations }, { response: latestObservations }, { response: alerts }] = await Promise.all([
      observationsPromise,
      latestObservationsPromise,
      alertsPromise
    ]);

    // Clean data
    const state: Partial<AppState> = {
      observations: chain((observations ?? []).concat(latestObservations ?? []))
        .uniqBy(x => x.observationId)
        .filter(x => !!x.speciesName)
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
        .map(x => ({
          ...x,
          speciesName: toTitleCase(x.speciesName),
          locations: x.locations === 'Montreal' ? 'Montréal' : x.locations
        }))
        .value()
    };

    setAppState(merge(state, defaultState) as AppState);
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch latest observations
  useEffect(() => {
    // Start only after initial fetch is done.
    if (appState) {
      const intervalId = setInterval(() => {
        refreshObservations();
      }, 10_000);

      return () => clearInterval(intervalId);
    }
  }, [appState, refreshObservations]);

  return { loading, appState };
};
