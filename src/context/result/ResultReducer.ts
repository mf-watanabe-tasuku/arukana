import { ACTIONS } from '../action-types';
import type { ResultItemProps } from '../../types';

type ActionProps = {
  type: string,
  payload: ResultItemProps[] | []
};

const ResultReducer = (state: ResultItemProps[], action: ActionProps) => {
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
