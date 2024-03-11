import { AppState } from './AppStoreProvider';
import { addYears } from 'date-fns/addYears';

export const defaultState: Partial<AppState> = {
  region: 'Montréal',
  filterFrom: addYears(new Date(), -1),
  filterTo: new Date(),
  invasiveOnly: true,
  alerts: [],
  observations: []
};
