import { useContext } from 'react';
import { AppStoreContext } from './AppStoreProvider';

export const useAppStore = () => {
  const context = useContext(AppStoreContext);

  return context;
};
