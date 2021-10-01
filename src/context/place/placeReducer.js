import { CLEAR_PLACES, SET_LOADING } from "../types";

const type = (state, action) => {
  switch (action.type) {
    case CLEAR_PLACES:
      return {
        ...state,
        loading: false,
        places: [],
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
