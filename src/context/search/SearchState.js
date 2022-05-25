import { useReducer } from 'react';
import SearchContext from './SearchContext';
import SearchReducer from './SearchReducer';
import { SET_ORIGIN_ADDRESS, SET_ORIGIN_GEOCODE, SET_FREE_KEYWORD } from '../types';

const SearchState = (props) => {
  const initialState = {
    originAddress: '',
    originGeocode: {},
    freeKeyword: '',
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

  return (
    <SearchContext.Provider
      value={{
        originAddress: state.originAddress,
        originGeocode: state.originGeocode,
        freeKeyword: state.freeKeyword,
        setOriginAddress,
        setOriginGeocode,
        setFreeKeyword,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
