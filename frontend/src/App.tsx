import AppStateProvider, { AppState } from './state/AppStateProvider';

const defaultState: Partial<AppState> = {
  region: 'Laval',
  regions: ['Laval', 'Montréal', 'Shawinigan']
};

const App: ReactFC = ({ children }) => {
  return <AppStateProvider state={defaultState}>{children}</AppStateProvider>;
};

export default App;
