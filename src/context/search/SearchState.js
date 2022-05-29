import { useReducer } from 'react';
import SearchContext from './SearchContext';
import SearchReducer from './SearchReducer';
import { SET_ORIGIN_ADDRESS, SET_ORIGIN_GEOCODE, SET_FREE_KEYWORD, SET_FREE_KEYWORDS, SET_TARGET_KEYWORDS, SET_RADIUS, SET_RECOMMEND_CHECKS, SET_ERROR_MESSAGES } from '../types';

const SearchState = (props) => {
  const initialState = {
    originAddress: '',
    originGeocode: {},
    freeKeyword: '',
    freeKeywords: [],
    targetKeywords: [],
    radius: process.env.REACT_APP_MAX_RADIUS,
    recommendChecks: {},
    errorMessages: {}
  };

  const [state, dispatch] = useReducer(SearchReducer, initialState);

  const setOriginAddress = (originAddress) =>
    dispatch({
      type: SET_ORIGIN_ADDRESS,
      payload: originAddress,
    });

  const setOriginGeocode = (originGeocode) =>
    dispatch({
      type: SET_ORIGIN_GEOCODE,
      payload: originGeocode,
    });

  const setFreeKeyword = (freeKeyword) => {
    dispatch({
      type: SET_FREE_KEYWORD,
      payload: freeKeyword,
    })
  }

  const setFreeKeywords = (freeKeywords) => {
    dispatch({
      type: SET_FREE_KEYWORDS,
      payload: freeKeywords
    })
  }

  const setTargetKeywords = (targetKeywords) => {
    dispatch({
      type: SET_TARGET_KEYWORDS,
      payload: targetKeywords
    })
  }

  const setRadius = (radius) => {
    dispatch({
      type: SET_RADIUS,
      payload: radius
    })
  }

  const setRecommendChecks = (recommendChecks) => {
    dispatch({
      type: SET_RECOMMEND_CHECKS,
      payload: recommendChecks
    })
  }

  const setErrorMessages = (errorMessages) => {
    dispatch({
      type: SET_ERROR_MESSAGES,
      payload: errorMessages
    })
  }

  return (
    <SearchContext.Provider
      value={{
        originAddress: state.originAddress,
        originGeocode: state.originGeocode,
        freeKeyword: state.freeKeyword,
        freeKeywords: state.freeKeywords,
        targetKeywords: state.targetKeywords,
        radius: state.radius,
        recommendChecks: state.recommendChecks,
        errorMessages: state.errorMessages,
        setOriginAddress,
        setOriginGeocode,
        setFreeKeyword,
        setFreeKeywords,
        setTargetKeywords,
        setRadius,
        setRecommendChecks,
        setErrorMessages
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
