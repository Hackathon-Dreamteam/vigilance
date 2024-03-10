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
  showInvasive: true,
  alertsCount: 3,
  observations: [
    createObservation('Monstera'),
    createObservation('Lapin sauvage'),
    createObservation('Faucon pelerin', { isInvasive: false }),
    createObservation('Écureuil albinos'),
    createObservation('Cerf'),
    createObservation('Cerf 2'),
    createObservation('Cerf 3'),
    createObservation('Cerf 4'),
    createObservation('Cerf 5'),
    createObservation('Cerf 6'),
    createObservation('Cerf 7'),
    createObservation('Cerf 8'),
    createObservation('Cerf 9'),
    createObservation('Cerf 10'),
    createObservation('Cerf 11'),
    createObservation('Cerf 12'),
    createObservation('Cerf 13')
  ]
};
