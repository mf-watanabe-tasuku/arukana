import { useReducer } from 'react';
import SearchContext from './SearchContext';
import SearchReducer from './SearchReducer';
import { SET_ORIGIN_ADDRESS, SET_ORIGIN_GEOCODE, SET_FREE_KEYWORD, SET_FREE_KEYWORDS, SET_TARGET_KEYWORDS } from '../types';

const SearchState = (props) => {
  const initialState = {
    originAddress: '',
    originGeocode: {},
    freeKeyword: '',
    freeKeywords: [],
    targetKeywords: [],
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

  return (
    <SearchContext.Provider
      value={{
        originAddress: state.originAddress,
        originGeocode: state.originGeocode,
        freeKeyword: state.freeKeyword,
        freeKeywords: state.freeKeywords,
        targetKeywords: state.targetKeywords,
        setOriginAddress,
        setOriginGeocode,
        setFreeKeyword,
        setFreeKeywords,
        setTargetKeywords,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
