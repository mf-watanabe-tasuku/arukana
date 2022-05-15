import { SET_ORIGIN_ADDRESS, SET_ORIGIN_GEOCODE } from "../types";

const type = (state, action) => {
  switch (action.type) {
    case SET_ORIGIN_ADDRESS:
      return {
        ...state,
        originAddress: action.payload,
      };
    case SET_ORIGIN_GEOCODE:
      return {
        ...state,
        originGeocode: action.payload,
      };
    default:
      return state;
  }
};

export default type;
