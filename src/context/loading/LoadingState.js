import React, { useReducer } from "react";
import LoadingContext from "./loadingContext";
import LoadingReducer from "./loadingReducer";
import { SET_LOADING } from "../types";

const LoadingState = (props) => {
  const initialState = {
    loading: false,
  };

  const [state, dispatch] = useReducer(LoadingReducer, initialState);

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <LoadingContext.Provider
      value={{
        loading: state.loading,
      }}
    >
      {props.children}
    </LoadingContext.Provider>
  );
};

export default LoadingState;
