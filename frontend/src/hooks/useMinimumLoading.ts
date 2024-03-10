import { useEffect, useState } from 'react';

export const useMinimumLoading = (condition: boolean, minimumLoading = 500) => {
  const [minLoading, setMinLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMinLoading(true);
    }, minimumLoading);
  }, [minimumLoading]);

  const loading = !minLoading || !condition;

  return loading;
};
