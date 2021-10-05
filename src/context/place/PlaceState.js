import React, { useEffect, useReducer } from "react";
import PlaceContext from "./placeContext";
import PlaceReducer from "./placeReducer";
import { SET_PLACES, CLEAR_PLACES, SET_LOADING } from "../types";

const PlaceState = (props) => {
  const initialState = {
    loading: false,
    places: [],
  };

  const [state, dispatch] = useReducer(PlaceReducer, initialState);

  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    googleMapScript.async = true;
    document.body.appendChild(googleMapScript);
  }, []);

  const setPlaces = (places) => dispatch({ type: SET_PLACES, payload: places });

  const clearPlaces = () => dispatch({ type: CLEAR_PLACES });

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <PlaceContext.Provider
      value={{
        loading: state.loading,
        places: state.places,
        setPlaces,
        clearPlaces,
        setLoading,
      }}
    >
      {props.children}
    </PlaceContext.Provider>
  );
};

export default PlaceState;
