import { Observation } from './models';
import { v4 as uuidv4 } from 'uuid';
import { AppState } from './AppStoreProvider';
import { addYears } from 'date-fns/addYears';

const createObservation = (speciesName: string, obs?: Partial<Observation>): Observation => ({
  id: uuidv4(),
  date: new Date(),
  imageUrl: '',
  isInvasive: true,
  isPrecarious: false,
  geoLocation: {
    latitude: 1,
    longitude: 2
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
    createObservation('Cerf')
  ]
};
