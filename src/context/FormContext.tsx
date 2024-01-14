import type {
  ChildrenNodeProps,
  FormContextType,
  FormReducerType,
  FormState,
  FormAction,
  SetOriginAddress,
  SetOriginGeocode,
  SetFreeKeyword,
  SetFreeKeywords,
  SetTargetKeywords,
  SetRadius,
  SetErrorMessages,
  SetRecommendChecks
} from '../types';
import { createContext, useReducer, useContext } from 'react';

const defaultValue = {
  originAddress: '',
  originGeocode: {
    lat: 0,
    lng: 0
  },
  freeKeyword: '',
  freeKeywords: [],
  targetKeywords: [],
  radius: String(process.env.REACT_APP_MAX_RADIUS),
  recommendChecks: {},
  errorMessages: {},
  setOriginAddress: () => {},
  setOriginGeocode: () => {},
  setFreeKeyword: () => {},
  setFreeKeywords: () => {},
  setRadius: () => {},
  setRecommendChecks: () => {},
  setTargetKeywords: () => {},
  setErrorMessages: () => {}
};

const FormContext = createContext<FormContextType>(defaultValue);

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_ORIGIN_ADDRESS':
      return {
        ...state,
        originAddress: action.payload
      };
    case 'SET_ORIGIN_GEOCODE':
      return {
        ...state,
        originGeocode: action.payload
      };
    case 'SET_FREE_KEYWORD':
      return {
        ...state,
        freeKeyword: action.payload
      };
    case 'SET_FREE_KEYWORDS':
      return {
        ...state,
        freeKeywords: action.payload
      };
    case 'SET_TARGET_KEYWORDS':
      return {
        ...state,
        targetKeywords: action.payload
      };
    case 'SET_RADIUS':
      return {
        ...state,
        radius: action.payload
      };
    case 'SET_RECOMMEND_CHECKS':
      return {
        ...state,
        recommendChecks: action.payload
      };
    case 'SET_ERROR_MESSAGES':
      return {
        ...state,
        errorMessages: action.payload
      };
    default:
      return state;
  }
};

const FormProvider: React.FC<ChildrenNodeProps> = ({ children }) => {
  const [formState, formDispatch] = useReducer<FormReducerType>(formReducer, defaultValue);

  const setOriginAddress: SetOriginAddress = address => {
    formDispatch({
      type: 'SET_ORIGIN_ADDRESS',
      payload: address
    });
  };

  const setOriginGeocode: SetOriginGeocode = geocode => {
    formDispatch({
      type: 'SET_ORIGIN_GEOCODE',
      payload: geocode
    });
  };

  const setFreeKeyword: SetFreeKeyword = keyword => {
    formDispatch({
      type: 'SET_FREE_KEYWORD',
      payload: keyword
    });
  };

  const setFreeKeywords: SetFreeKeywords = freeKeywords => {
    formDispatch({
      type: 'SET_FREE_KEYWORDS',
      payload: freeKeywords
    });
  };

  const setTargetKeywords: SetTargetKeywords = targetKeywords => {
    formDispatch({
      type: 'SET_TARGET_KEYWORDS',
      payload: targetKeywords
    });
  };

  const setRadius: SetRadius = radius => {
    formDispatch({
      type: 'SET_RADIUS',
      payload: radius
    });
  };

  const setErrorMessages: SetErrorMessages = errorMessages => {
    formDispatch({
      type: 'SET_ERROR_MESSAGES',
      payload: errorMessages
    });
  };

  const setRecommendChecks: SetRecommendChecks = recommendChecks => {
    formDispatch({
      type: 'SET_RECOMMEND_CHECKS',
      payload: recommendChecks
    });
  };

  return (
    <FormContext.Provider value={{
      originAddress: formState.originAddress,
      originGeocode: formState.originGeocode,
      freeKeyword: formState.freeKeyword,
      freeKeywords: formState.freeKeywords,
      targetKeywords: formState.targetKeywords,
      radius: formState.radius,
      recommendChecks: formState.recommendChecks,
      errorMessages: formState.errorMessages,
      setOriginAddress,
      setOriginGeocode,
      setFreeKeyword,
      setFreeKeywords,
      setRadius,
      setRecommendChecks,
      setTargetKeywords,
      setErrorMessages
    }}>
      {children}
    </FormContext.Provider>
  );
};

const useForm = () => useContext(FormContext);

export { FormProvider, useForm };
