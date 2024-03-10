import Header from './components/layout/Header';
import AppStateProvider from './state/AppStateProvider';
import { defaultState } from './state/defaultState';

const App: ReactFC = ({ children }) => {
  return (
    <AppStateProvider state={defaultState}>
      <Header />
      {children}
    </AppStateProvider>
  );
};

export default App;
