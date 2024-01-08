import type { ResultState, ResultAction } from '../../types';

const ResultReducer = (state: ResultState, action: ResultAction): ResultState => {
  switch (action.type) {
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload
      };
    default:
      return state;
  }
};

export default ResultReducer;
