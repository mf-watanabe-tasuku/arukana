import type { ChildrenNodeProps, ResultsContextType, ResultProps } from '../types';
import { createContext, useState, useContext } from 'react';

const defaultValue = {
  results: [],
  setResults: () => {}
};

const ResultsContext = createContext<ResultsContextType>(defaultValue);

const ResultsProvider: React.FC<ChildrenNodeProps> = ({ children }) => {
  const [results, setResults] = useState<ResultProps[]>([]);

  return (
    <ResultsContext.Provider value={{results, setResults}}>
      {children}
    </ResultsContext.Provider>
  );
};

const useResults = () => useContext(ResultsContext);

export { ResultsProvider, useResults };
