import React, { useReducer } from "react";
import SearchContext from "./searchContext";
import SearchReducer from "./searchReducer";
import { SET_GEOCODE } from "../types";

const SearchState = (props) => {
  const initialState = {
    originAddress: "",
  };

  const [state, dispatch] = useReducer(SearchReducer, initialState);

  const setGeocode = (geocode) =>
    dispatch({
      type: SET_GEOCODE,
      payload: geocode,
    });

  return (
    <SearchContext.Provider
      value={{ originAddress: state.originAddress, setGeocode }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
