import type { State, Action } from '../../types';
import { ACTIONS } from '../action-types';

const ResultReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
      };
    default:
      return state;
  }
};

export default ResultReducer;
