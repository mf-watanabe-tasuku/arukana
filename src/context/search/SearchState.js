import { useReducer } from 'react';
import SearchContext from './SearchContext';
import SearchReducer from './SearchReducer';
import { SET_ORIGIN_ADDRESS, SET_ORIGIN_GEOCODE, SET_FREE_KEYWORD, SET_FREE_KEYWORDS } from '../types';

const SearchState = (props) => {
  const initialState = {
    originAddress: '',
    originGeocode: {},
    freeKeyword: '',
    freeKeywords: []
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

  return (
    <SearchContext.Provider
      value={{
        originAddress: state.originAddress,
        originGeocode: state.originGeocode,
        freeKeyword: state.freeKeyword,
        freeKeywords: state.freeKeywords,
        setOriginAddress,
        setOriginGeocode,
        setFreeKeyword,
        setFreeKeywords
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
