import React, { useReducer } from "react";
import SearchContext from "./searchContext";
import SearchReducer from "./searchReducer";

const SearchState = (props) => {
  const initialState = {
    originAddress: "",
  };

  const [state, dispatch] = useReducer(SearchReducer, initialState);

  return (
    <SearchContext.Provider value={{ originAddress: state.originAddress }}>
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
