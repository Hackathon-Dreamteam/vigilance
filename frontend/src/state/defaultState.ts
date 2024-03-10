import { Observation } from './models';
import { v4 as uuidv4 } from 'uuid';
import { AppState } from './AppStoreProvider';
import { addYears } from 'date-fns/addYears';

const createObservation = (speciesName: string, obs?: Partial<Observation>): Observation => ({
  observationId: uuidv4(),
  date: new Date(),
  imageUrl: '',
  isInvasive: Boolean(Math.round(Math.random())),
  isPrecarious: Boolean(Math.round(Math.random())),
  geoLocation: {
    latitude: 45.6 + Math.random() / 10,
    longitude: -73.72115787038962 + Math.random() / 10
  },
  speciesName,
  location: 'Laval',
  source: 'Community',
  ...obs
});

export const defaultState: Partial<AppState> = {
  region: 'Laval',
  filterFrom: addYears(new Date(), -1),
  filterTo: new Date(),
  invasiveOnly: false,
  alertsCount: 3,
  observations: []
};
