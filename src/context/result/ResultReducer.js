import { ACTIONS } from '../types';

const ResultReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
      };
    case ACTIONS.CLEAR_RESULTS:
      return {
        ...state,
        results: [],
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default ResultReducer;
