import Header from './components/layout/Header';
import AppStateProvider, { AppState } from './state/AppStateProvider';
import { addMonths } from 'date-fns/addMonths';

const defaultState: Partial<AppState> = {
  region: 'Laval',
  regions: ['Laval', 'Montréal', 'Shawinigan'],
  filterFrom: addMonths(new Date(), -1),
  filterTo: new Date(),
  showInvasive: true,
  alertsCount: 3
};

const App: ReactFC = ({ children }) => {
  return (
    <AppStateProvider state={defaultState}>
      <Header />
      {children}
    </AppStateProvider>
  );
};

export default App;
