import { createContext, useReducer, useContext } from 'react';

const ResultsContext = createContext([]);
const ResultsDispatchContext = createContext();

const ResultsProvider = ({ children }) => {
  const [results, resultsDispatch] = useReducer((_, payload) => payload, []);

  return (
    <ResultsContext.Provider value={results}>
      <ResultsDispatchContext.Provider value={resultsDispatch}>
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
