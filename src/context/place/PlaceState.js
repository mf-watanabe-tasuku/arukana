import React, { useReducer } from "react";
import PlaceContext from "./placeContext";
import PlaceReducer from "./placeReducer";
import { HOGE } from "../types";

const PlaceState = (props) => {
  const initialState = {};

  const [state, dispatch] = useReducer(PlaceReducer, initialState);

  return (
    <PlaceContext.Provider value={{}}>{props.children}</PlaceContext.Provider>
  );
};

export default PlaceState;
