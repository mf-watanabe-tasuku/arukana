import { useEffect, useReducer } from 'react';
import ResultContext from './ResultContext';
import ResultReducer from './ResultReducer';
import { SET_RESULTS, CLEAR_RESULTS, SET_LOADING } from '../types';

const ResultState = (props) => {
  const initialState = {
    loading: false,
    results: [],
  };

  const [state, dispatch] = useReducer(ResultReducer, initialState);

  useEffect(() => {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    googleMapScript.async = true;
    document.body.appendChild(googleMapScript);
  }, []);

  const setResults = (results) =>
    dispatch({ type: SET_RESULTS, payload: results });

  const clearResults = () => dispatch({ type: CLEAR_RESULTS });

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <ResultContext.Provider
      value={{
        loading: state.loading,
        results: state.results,
        setResults,
        clearResults,
        setLoading,
      }}
    >
      {props.children}
    </ResultContext.Provider>
  );
};

export default ResultState;