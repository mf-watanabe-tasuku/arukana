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
  KeyboardEvent,
  RemoveFreeKeyword,
  SetRecommendChecks
} from '../../types';
import FormContext from './FormContext';
import FormReducer from './FormReducer';

const FormState: React.FC<ChildrenNodeProps> = props => {
  const keywordMaxCount = Number(process.env.REACT_APP_KEYWORD_MAX_COUNT);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.target.value;
    const { name, checked } = e.target;
    const keywordIndex = state.targetKeywords.indexOf(targetValue);

    let newTargetKeywords: string[] | [] = [];
    if (checked && keywordIndex === -1) {
      newTargetKeywords = [...state.targetKeywords, targetValue]
    }
    if (!checked && keywordIndex > -1) {
      newTargetKeywords = state.targetKeywords.filter((_, i) => i !== keywordIndex)
    }

    setTargetKeywords(newTargetKeywords);
    setRecommendChecks({ ...state.recommendChecks, [name]: checked });
  };

  const addFreeKeywords: KeyboardEvent = e => {
    if (e.key !== 'Enter') return;

    if (keywordMaxCount && state.freeKeywords.length + 1 > keywordMaxCount) {
      setErrorMessages({
        ...state.errorMessages,
        keyword: `一度に入力できるのは${keywordMaxCount}個までです`,
      });
      return;
    }

    const targetValue = e.currentTarget.value.trim();
    if (state.freeKeywords.indexOf(targetValue) === -1) {
      const { keyword, ...errorMessages } = state.errorMessages;
      setErrorMessages(errorMessages);
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

  const removeFreeKeyword: RemoveFreeKeyword = keyword => {
    const keywordIndex = state.freeKeywords.indexOf(keyword);
    if (keywordIndex === -1) return;
    state.freeKeywords.splice(keywordIndex, 1);
    setFreeKeywords([...state.freeKeywords]);

    const targetKeywordsIndex = state.targetKeywords.indexOf(keyword);
    if (targetKeywordsIndex === -1) return;
    state.targetKeywords.splice(targetKeywordsIndex, 1);
    setTargetKeywords([...state.targetKeywords]);
  };

  const validateSearchValues = () => {
    const validationErrors = {
      originAddress: '',
      keyword: '',
      radius: ''
    };

    // 基準地点が空の場合はエラー
    if (!state.originAddress)
      validationErrors.originAddress = '基準地点を入力してください';

    // 検索対象のキーワードが空の場合はエラー
    if (state.targetKeywords.length === 0)
      validationErrors.keyword = '検索する施設を選択または入力してください';

    // 半径距離が空の場合はエラー
    if (!state.radius) {
      validationErrors.radius = '検索したい半径距離を入力してください';
    // 半径距離が半角数字以外の場合、または半角数字を含まない場合(ピリオドのみ)はエラー
    } else if (String(state.radius).match(/[^0-9\.]+/) || !String(state.radius).match(/[0-9]+/)) {
      validationErrors.radius = '半角数字で入力してください';
    // 半径距離が小数点を複数個含む場合はエラー
    } else if (String(state.radius).match(/\..*\./)) {
      validationErrors.radius = '整数か小数で入力してください';
    } else {
      // stateに保持している半径距離をStringからFloatに変換
      const radiusInFloat = parseFloat(String(state.radius));

      const maxRadius = process.env.REACT_APP_MAX_RADIUS;
      const minRadius = process.env.REACT_APP_MIN_RADIUS;

      // 半径距離が最大値より大きい場合はエラーをセット
      if (radiusInFloat > Number(maxRadius)) {
        const formattedMaxRadius = maxRadius?.toLocaleString();
        validationErrors.radius = `半径${formattedMaxRadius}mより大きな値は指定できません`;
      // 半径距離が最小値より小さい場合はエラーをセット
      } else if (radiusInFloat < Number(minRadius)) {
        const formattedMinRadius = minRadius?.toLocaleString();
        validationErrors.radius = `半径${formattedMinRadius}m未満は指定できません`;
      // 半径距離が最大値以下・最小値以上である場合は、radius stateを文字列型の値で更新
      } else {
        setRadius(String(radiusInFloat));
      }
    }

    return validationErrors;
  };

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
        addFreeKeywords,
        handleCheckboxChange,
        removeFreeKeyword,
        setRadius,
        validateSearchValues,
        setErrorMessages
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
};

export default FormState;
