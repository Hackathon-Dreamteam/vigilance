import { useContext } from 'react';
import { AppStateContext } from './AppStateProvider';

export const useAppState = () => {
  const context = useContext(AppStateContext);

  return context;
};
