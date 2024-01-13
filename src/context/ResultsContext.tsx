import type { ChildrenNodeProps, ResultsContextType, ResultsState } from '../types';
import { createContext, useState, useContext } from 'react';

const initialState = {
  results: [],
  setResults: () => {}
};

const ResultsContext = createContext<ResultsContextType>(initialState);

const ResultsProvider: React.FC<ChildrenNodeProps> = ({ children }) => {
  const [results, setResults] = useState<ResultsState>([]);

  return (
    <ResultsContext.Provider value={{results, setResults}}>
      {children}
    </ResultsContext.Provider>
  );
};

const useResults = () => {
  return useContext(ResultsContext);
}

export { ResultsProvider, useResults };
