import { useReducer } from 'react';
import type {
  ChildrenNodeProps,
  SearchReducerType,
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
import SearchContext from './SearchContext';
import SearchReducer from './SearchReducer';

const SearchState: React.FC<ChildrenNodeProps> = props => {
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

  const [state, dispatch] = useReducer<SearchReducerType>(SearchReducer, initialState);

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
    setErrorMessages({});
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
    // 半径距離が半角数字以外の場合はエラー
    } else if (String(state.radius).match(/[^0-9\.]+/) || !String(state.radius).match(/[0-9]+/)) {
      validationErrors.radius = '半角数字で入力してください';
    // 半径距離が小数点を複数個含む場合はエラー
    } else if (String(state.radius).match(/\..*\./)) {
      validationErrors.radius = '整数か小数で入力してください';
    } else {
      const formattedMaxRadius = process.env.REACT_APP_MAX_RADIUS?.toLocaleString();
      const formattedMinRadius = process.env.REACT_APP_MIN_RADIUS?.toLocaleString();

      // stateに保持している半径距離をStringからFloatに変換
      const radiusInFloat = parseFloat(String(state.radius));

      if (radiusInFloat > Number(process.env.REACT_APP_MAX_RADIUS)) {
        validationErrors.radius = `半径${formattedMaxRadius}mより大きな値は指定できません`;
      } else if (radiusInFloat < Number(process.env.REACT_APP_MIN_RADIUS)) {
        validationErrors.radius = `半径${formattedMinRadius}m未満は指定できません`;
      } else {
        // Floatに変換した半径距離が最大値と最小値の間に収まっている場合は、state.radiusをFloat型の値で更新
        setRadius(String(radiusInFloat));
      }
    }

    setErrorMessages(validationErrors);

    return validationErrors;
  };

  /**
   * 半径距離が入力された際の処理
   * @param [React.ChangeEventHandler<HTMLInputElement>] e - イベントオブジェクト
   * @returns [void]
   */
  const handleInputRadius: React.ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault();

    const inputRadius = e.target.value;
    // errorMessagesオブジェクトの初期化
    let errorMessages = {};

    // 半径距離に0から9までの数字およびピリオド以外が含まれている場合はエラー
    if (inputRadius.match(/[^0-9\.]+/)) {
      errorMessages = {
        ...state.errorMessages,
        radius: '半角数字で入力してください'
      };
    // 半径距離にピリオドが複数含まれている場合はエラー
    } else if (inputRadius.match(/\..*\./)) {
      errorMessages = {
        ...state.errorMessages,
        radius: '整数か小数で入力してください'
      };
    // 入力された半径距離に問題がない場合は、errorMessages stateからradiusプロパティを削除
    } else {
      const { radius, ...errorMessagesExceptRadius } = state.errorMessages;
      errorMessages = errorMessagesExceptRadius;
    }

    // stateの更新
    setErrorMessages(errorMessages);
    setRadius(inputRadius);
  }

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
        addFreeKeywords,
        handleCheckboxChange,
        removeFreeKeyword,
        validateSearchValues,
        handleInputRadius
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
