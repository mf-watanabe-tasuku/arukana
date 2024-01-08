import type { SearchState, SearchAction } from '../../types';

const SearchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_ORIGIN_ADDRESS':
      return {
        ...state,
        originAddress: action.payload
      };
    case 'SET_ORIGIN_GEOCODE':
      return {
        ...state,
        originGeocode: action.payload
      };
    case 'SET_FREE_KEYWORD':
      return {
        ...state,
        freeKeyword: action.payload
      };
    case 'SET_FREE_KEYWORDS':
      return {
        ...state,
        freeKeywords: action.payload
      };
    case 'SET_TARGET_KEYWORDS':
      return {
        ...state,
        targetKeywords: action.payload
      };
    case 'SET_RADIUS':
      return {
        ...state,
        radius: action.payload
      };
    case 'SET_RECOMMEND_CHECKS':
      return {
        ...state,
        recommendChecks: action.payload
      };
    case 'SET_ERROR_MESSAGES':
      return {
        ...state,
        errorMessages: action.payload
      };
    default:
      return state;
  }
};

export default SearchReducer;
