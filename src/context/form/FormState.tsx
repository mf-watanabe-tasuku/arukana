import { useReducer } from 'react';
import type {
  ChildrenNodeProps,
  FormReducerType,
  SetOriginAddress,
  SetOriginGeocode,
  SetFreeKeyword,
  SetFreeKeywords,
  SetTargetKeywords,
  SetRadius,
  SetErrorMessages,
  SetRecommendChecks
} from '../../types';
import FormContext from './FormContext';
import FormReducer from './FormReducer';

const FormState: React.FC<ChildrenNodeProps> = props => {
  const initialState = {
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
  };

  const [state, dispatch] = useReducer<FormReducerType>(FormReducer, initialState);

  const setOriginAddress: SetOriginAddress = address => {
    dispatch({
      type: 'SET_ORIGIN_ADDRESS',
      payload: address
    });
  };

  const setOriginGeocode: SetOriginGeocode = geocode => {
    dispatch({
      type: 'SET_ORIGIN_GEOCODE',
      payload: geocode
    });
  };

  const setFreeKeyword: SetFreeKeyword = keyword => {
    dispatch({
      type: 'SET_FREE_KEYWORD',
      payload: keyword
    });
  };

  const setFreeKeywords: SetFreeKeywords = freeKeywords => {
    dispatch({
      type: 'SET_FREE_KEYWORDS',
      payload: freeKeywords
    });
  };

  const setTargetKeywords: SetTargetKeywords = targetKeywords => {
    dispatch({
      type: 'SET_TARGET_KEYWORDS',
      payload: targetKeywords
    });
  };

  const setRadius: SetRadius = radius => {
    dispatch({
      type: 'SET_RADIUS',
      payload: radius,
    });
  }

  const setErrorMessages: SetErrorMessages = errorMessages => {
    dispatch({
      type: 'SET_ERROR_MESSAGES',
      payload: errorMessages
    });
  };

  const setRecommendChecks: SetRecommendChecks = recommendChecks => {
    dispatch({
      type: 'SET_RECOMMEND_CHECKS',
      payload: recommendChecks,
    });
  }

  return (
    <FormContext.Provider
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
        setRadius,
        setRecommendChecks,
        setTargetKeywords,
        setErrorMessages
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
};

export default FormState;
