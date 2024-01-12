import type { ChildrenNodeProps, ResultsState } from '../types';
import { createContext, useState, useContext } from 'react';

const ResultsContext = createContext<ResultsState>([]);
const ResultsDispatchContext = createContext<React.Dispatch<ResultsState>>(() => {});

const ResultsProvider: React.FC<ChildrenNodeProps> = ({ children }) => {
  const [results, setResults] = useState<ResultsState>([]);

  return (
    <ResultsContext.Provider value={results}>
      <ResultsDispatchContext.Provider value={setResults}>
        {children}
      </ResultsDispatchContext.Provider>
    </ResultsContext.Provider>
  );
};

const useResults = () => {
  return useContext(ResultsContext);
}

const useResultsDispatch = () => {
  return useContext(ResultsDispatchContext);
}

export { ResultsProvider, useResults, useResultsDispatch };
