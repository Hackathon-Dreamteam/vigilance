import { addMonths } from 'date-fns/addMonths';
import { AppState } from './AppStateProvider';
import { Observation } from './models';
import { v4 as uuidv4 } from 'uuid';

const createObservation = (speciesName: string, obs?: Partial<Observation>): Observation => ({
  id: uuidv4(),
  date: new Date(),
  imageUrl: '',
  isEnvasive: Boolean(Math.round(Math.random())),
  isPrecarious: Boolean(Math.round(Math.random())),
  location: {
    latitude: 45.6 + Math.random() / 10,
    longitude: -73.72115787038962 + Math.random() / 10
  },
  speciesName,
  region: 'Laval',
  ...obs
});

export const defaultState: Partial<AppState> = {
  region: 'Laval',
  regions: ['Laval', 'Montréal', 'Shawinigan'],
  filterFrom: addMonths(new Date(), -1),
  filterTo: new Date(),
  showInvasive: true,
  alertsCount: 3,
  observations: [
    createObservation('Monstera'),
    createObservation('Lapin sauvage'),
    createObservation('Faucon pelerin', { isEnvasive: false }),
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
