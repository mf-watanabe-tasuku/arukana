import { useReducer } from 'react';
import type { ChildrenNodeProps, ResultReducerType, SetResults } from '../../types';
import { ACTIONS } from '../action-types';
import ResultContext from './ResultContext';
import ResultReducer from './ResultReducer';

const ResultState: React.FC<ChildrenNodeProps> = (props) => {
  const initialResultsState = {
    results: []
  };

  const [state, dispatch] = useReducer<ResultReducerType>(ResultReducer, initialResultsState);

  const setResults: SetResults = results => {
    dispatch({
      type: ACTIONS.SET_RESULTS,
      payload: results
    });
  }

  return (
    <ResultContext.Provider
      value={{
        results: state.results,
        setResults
      }}
    >
      {props.children}
    </ResultContext.Provider>
  );
};

export default ResultState;
