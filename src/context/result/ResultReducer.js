import { SET_RESULTS, CLEAR_RESULTS, SET_LOADING } from "../types";

const type = (state, action) => {
  switch (action.type) {
    case SET_RESULTS:
      return {
        ...state,
        loading: false,
        results: action.payload,
      };
    case CLEAR_RESULTS:
      return {
        ...state,
        loading: false,
        results: [],
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default type;
