import { useReducer } from 'react';
import SearchContext from './SearchContext';
import SearchReducer from './SearchReducer';
import { SET_ORIGIN_ADDRESS, SET_ORIGIN_GEOCODE } from '../types';

const SearchState = (props) => {
  const initialState = {
    originAddress: '',
    originGeocode: {},
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

  return (
    <SearchContext.Provider
      value={{
        originAddress: state.originAddress,
        originGeocode: state.originGeocode,
        setOriginAddress,
        setOriginGeocode,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
