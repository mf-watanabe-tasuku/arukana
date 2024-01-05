import { useReducer } from 'react';
import ResultContext from './ResultContext';
import ResultReducer from './ResultReducer';
import { ACTIONS } from '../action-types';

const ResultState = (props) => {
  const initialState = {
    results: [],
  };

  const [state, dispatch] = useReducer(ResultReducer, initialState);

  const resultsWithPlace = state.results.filter(result => result.nearestPlace);
  const resultsWithoutPlace = state.results.filter(result => !result.nearestPlace);

  const setResults = (results) =>
    dispatch({
      type: ACTIONS.SET_RESULTS,
      payload: results
    });

  return (
    <ResultContext.Provider
      value={{
        results: state.results,
        resultsWithPlace,
        resultsWithoutPlace,
        setResults
      }}
    >
      {props.children}
    </ResultContext.Provider>
  );
};

export default ResultState;
