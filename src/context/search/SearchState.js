import { useReducer } from 'react';
import SearchContext from './SearchContext';
import SearchReducer from './SearchReducer';
import {
  SET_ORIGIN_ADDRESS,
  SET_ORIGIN_GEOCODE,
  SET_FREE_KEYWORD,
  SET_FREE_KEYWORDS,
  SET_TARGET_KEYWORDS,
  SET_RADIUS,
  SET_RECOMMEND_CHECKS,
  SET_ERROR_MESSAGES,
} from '../types';

const SearchState = (props) => {
  const keywordMaxCount = process.env.REACT_APP_KEYWORD_MAX_COUNT;

  const initialState = {
    originAddress: '',
    originGeocode: {},
    freeKeyword: '',
    freeKeywords: [],
    targetKeywords: [],
    radius: process.env.REACT_APP_MAX_RADIUS,
    recommendChecks: {},
    errorMessages: {},
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
    });
  };

  const setFreeKeywords = (freeKeywords) => {
    dispatch({
      type: SET_FREE_KEYWORDS,
      payload: freeKeywords,
    });
  };

  const setTargetKeywords = (targetKeywords) => {
    dispatch({
      type: SET_TARGET_KEYWORDS,
      payload: targetKeywords,
    });
  };

  const setRadius = (radius) => {
    dispatch({
      type: SET_RADIUS,
      payload: radius,
    });
  };

  const setRecommendChecks = (recommendChecks) => {
    dispatch({
      type: SET_RECOMMEND_CHECKS,
      payload: recommendChecks,
    });
  };

  const setErrorMessages = (errorMessages) => {
    dispatch({
      type: SET_ERROR_MESSAGES,
      payload: errorMessages,
    });
  };

  const handleCheckboxChange = (e) => {
    const targetValue = e.target.value;
    const { name, checked } = e.target;
    const keywordIndex = state.targetKeywords.indexOf(targetValue);
    if (checked && keywordIndex === -1) {
      setTargetKeywords([...state.targetKeywords, targetValue]);
    }
    if (!checked && keywordIndex > -1) {
      state.targetKeywords.splice(keywordIndex, 1);
      setTargetKeywords([...state.targetKeywords]);
    }
    setRecommendChecks({ ...state.recommendChecks, [name]: checked });
  };

  const addFreeKeywords = (e) => {
    if (e.key !== 'Enter') return;

    if (state.freeKeywords.length + 1 > keywordMaxCount) {
      setErrorMessages({
        ...state.errorMessages,
        keyword: `一度に入力できるのは${keywordMaxCount}個までです`,
      });
      return;
    }

    const targetValue = e.target.value.trim();
    if (state.freeKeywords.indexOf(targetValue) === -1) {
      setErrorMessages(delete state.errorMessages.keyword);
    } else {
      setErrorMessages({
        ...state.errorMessages,
        keyword: `${targetValue}はすでに入力済みです`,
      });
      return;
    }

    if (targetValue) {
      setTargetKeywords([...state.targetKeywords, state.freeKeyword]);
      setFreeKeywords([...state.freeKeywords, state.freeKeyword]);
      setFreeKeyword('');
    }
  };

  return (
    <SearchContext.Provider
      value={{
        originAddress: state.originAddress,
        originGeocode: state.originGeocode,
        freeKeyword: state.freeKeyword,
        freeKeywords: state.freeKeywords,
        targetKeywords: state.targetKeywords,
        radius: state.radius,
        recommendChecks: state.recommendChecks,
        errorMessages: state.errorMessages,
        setOriginAddress,
        setOriginGeocode,
        setFreeKeyword,
        setFreeKeywords,
        addFreeKeywords,
        setTargetKeywords,
        setRadius,
        setRecommendChecks,
        handleCheckboxChange,
        setErrorMessages,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
