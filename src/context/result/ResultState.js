import { useReducer } from 'react';
import ResultContext from './ResultContext';
import ResultReducer from './ResultReducer';
import { ACTIONS } from '../types';

const ResultState = (props) => {
  const initialState = {
    results: [],
  };

  const [state, dispatch] = useReducer(ResultReducer, initialState);

  const setResults = (results) =>
    dispatch({
      type: ACTIONS.SET_RESULTS,
      payload: results
    });

  const clearResults = () =>
    dispatch({
      type: ACTIONS.CLEAR_RESULTS,
    });

  return (
    <ResultContext.Provider
      value={{
        results: state.results,
        setResults,
        clearResults,
      }}
    >
      {props.children}
    </ResultContext.Provider>
  );
};

export default ResultState;
