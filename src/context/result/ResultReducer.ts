import type { ResultState, ResultAction } from '../../types';
import { ACTIONS } from '../action-types';

const ResultReducer = (state: ResultState, action: ResultAction): ResultState => {
  switch (action.type) {
    case ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload
      };
    default:
      return state;
  }
};

export default ResultReducer;
