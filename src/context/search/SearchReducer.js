import { ACTIONS } from '../action-types';

const SearchReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ORIGIN_ADDRESS:
      return {
        ...state,
        originAddress: action.payload,
      };
    case ACTIONS.SET_ORIGIN_GEOCODE:
      return {
        ...state,
        originGeocode: action.payload,
      };
    case ACTIONS.SET_FREE_KEYWORD:
      return {
        ...state,
        freeKeyword: action.payload,
      };
    case ACTIONS.SET_FREE_KEYWORDS:
      return {
        ...state,
        freeKeywords: action.payload,
      };
    case ACTIONS.SET_TARGET_KEYWORDS:
      return {
        ...state,
        targetKeywords: action.payload,
      };
    case ACTIONS.SET_RADIUS:
      return {
        ...state,
        radius: action.payload,
      };
    case ACTIONS.SET_RECOMMEND_CHECKS:
      return {
        ...state,
        recommendChecks: action.payload,
      };
    case ACTIONS.SET_ERROR_MESSAGES:
      return {
        ...state,
        errorMessages: action.payload,
      };
    default:
      return state;
  }
};

export default SearchReducer;
