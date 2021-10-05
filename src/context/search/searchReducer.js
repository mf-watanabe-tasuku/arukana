import { SET_GEOCODE } from "../types";

const searchReducer = (state, action) => {
  switch (action.type) {
    case SET_GEOCODE:
      return {
        ...state,
        geocode: action.payload,
      };
    default:
      return state;
  }
};

export default searchReducer;
