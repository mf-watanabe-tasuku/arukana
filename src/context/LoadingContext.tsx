import type { ChildrenNodeProps, LoadingContextType } from '../types';
import { createContext, useState, useContext } from 'react';

const defaultValue = {
  loading: false,
  setLoading: () => {}
}

const LoadingContext = createContext<LoadingContextType>(defaultValue);

const LoadingProvider: React.FC<ChildrenNodeProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{loading, setLoading}}>
      {children}
    </LoadingContext.Provider>
  );
};

const useLoading = () => {
  return useContext(LoadingContext);
}

export { LoadingProvider, useLoading };
