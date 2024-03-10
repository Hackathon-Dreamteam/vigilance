import { addMonths } from 'date-fns/addMonths';
import { AppState } from './AppStateProvider';
import { Observation } from './models';
import { v4 as uuidv4 } from 'uuid';

const createObservation = (speciesName: string, obs?: Partial<Observation>): Observation => ({
  id: uuidv4(),
  date: new Date(),
  imageUrl: '',
  isEnvasive: true,
  isPrecarious: false,
  location: {
    latitude: 1,
    longitude: 2
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
    createObservation('Faucon pelerin'),
    createObservation('Écureuil albinos'),
    createObservation('Cerf')
  ]
};
