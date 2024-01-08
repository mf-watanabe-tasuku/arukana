import { useReducer } from 'react';
import type {
  ChildrenNodeProps,
  SearchReducerType,
  SetOriginAddress,
  SetFreeKeyword,
  SetFreeKeywords,
  SetTargetKeywords,
  SetErrorMessages,
  KeyboardEvent,
  RemoveFreeKeyword,
  FormatDistanceWithUnit,
  originGeocode,
  FormattedNearbyPlace,
  FormattedNearbyPlaces
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

  const setOriginAddress: SetOriginAddress = address =>
    dispatch({
      type: 'SET_ORIGIN_ADDRESS',
      payload: address,
    });

  const setFreeKeyword: SetFreeKeyword = keyword => {
    dispatch({
      type: 'SET_FREE_KEYWORD',
      payload: keyword,
    });
  };

  const setFreeKeywords: SetFreeKeywords = freeKeywords => {
    dispatch({
      type: 'SET_FREE_KEYWORDS',
      payload: freeKeywords,
    });
  };

  const setTargetKeywords: SetTargetKeywords = targetKeywords => {
    dispatch({
      type: 'SET_TARGET_KEYWORDS',
      payload: targetKeywords,
    });
  };

  const setErrorMessages: SetErrorMessages = errorMessages => {
    dispatch({
      type: 'SET_ERROR_MESSAGES',
      payload: errorMessages,
    });
  };

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
    dispatch({
      type: 'SET_RECOMMEND_CHECKS',
      payload: { ...state.recommendChecks, [name]: checked },
    });
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
      const radiusInFloat = parseFloat(state.radius);

      if (radiusInFloat > Number(process.env.REACT_APP_MAX_RADIUS)) {
        validationErrors.radius = `半径${formattedMaxRadius}mより大きな値は指定できません`;
      } else if (radiusInFloat < Number(process.env.REACT_APP_MIN_RADIUS)) {
        validationErrors.radius = `半径${formattedMinRadius}m未満は指定できません`;
      } else {
        // Floatに変換した半径距離が最大値と最小値の間に収まっている場合は、state.radiusをFloat型の値で更新
        dispatch({
          type: 'SET_RADIUS',
          payload: String(radiusInFloat),
        });
      }
    }

    setErrorMessages(validationErrors);

    return validationErrors;
  };

  // 基準地点の座標を取得する
  const setOriginGeocode = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const originGeocode = await geocoder.geocode(
      { address: state.originAddress },
      (results, status) => (status === 'OK' ? results : status)
    );

    const formattedOriginGeocode = {
      lat: originGeocode.results[0].geometry.location.lat(),
      lng: originGeocode.results[0].geometry.location.lng(),
    };

    dispatch({
      type: 'SET_ORIGIN_GEOCODE',
      payload: formattedOriginGeocode
    });

    return formattedOriginGeocode;
  };

  // 周辺の施設を検索する
  const div = document.createElement('div');
  const fetchNearbyPlaces = (geocode: originGeocode, keyword: string) => {
    const service = new window.google.maps.places.PlacesService(div);
    const searchConditions = {
      location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
      radius: Number(state.radius),
      keyword
    };

    return new Promise(resolve => {
      service.nearbySearch(searchConditions, async nearbyPlaces => {
        const formattedNearbyPlaces: FormattedNearbyPlaces | undefined = nearbyPlaces?.map(nearbyPlace => {
          return {
            name: nearbyPlace.name,
            rating: nearbyPlace.rating,
            ratings_total: nearbyPlace.user_ratings_total,
            lat: nearbyPlace?.geometry?.location?.lat(),
            lng: nearbyPlace?.geometry?.location?.lng()
          };
        });

        const placeDistanceData = await getPlaceDistanceData(formattedNearbyPlaces);
        const keywordWithResults = {
          keyword,
          ...placeDistanceData
        };

        resolve(keywordWithResults);
      });
    });
  };

  const getPlaceDistanceData = async (places: FormattedNearbyPlaces | undefined) => {
    if (!places) return;

    const placesWithDistance = await Promise.all(
      places.map(async place => {
        const distanceData = await fetchDistanceData(place);

        const placeWithDistanceObj = {
          name: place.name,
          rating: place.rating,
          reviewCount: place.ratings_total,
          geocode: { lat: place.lat, lng: place.lng },
          ...distanceData
        };
        return placeWithDistanceObj;
      })
    );

    const filteredResults = placesWithDistance.filter(place => {
      return place.distance && place.distance <= Number(state.radius);
    });

    const sortedResults = filteredResults.sort((place_a, place_b) => {
      if (place_a.distance === undefined || place_b.distance === undefined) return 0;

      return place_a.distance - place_b.distance;
    });

    const [nearestPlace, ...nearbyPlaces] = sortedResults.slice(0, 4);

    const placeDistanceData = { nearestPlace, nearbyPlaces };

    return placeDistanceData;
  };

  // 距離と所要時間を取得してオブジェクトで返す
  const fetchDistanceData = (place: FormattedNearbyPlace): Promise<{ distance: number | undefined; duration: string | undefined; }> => {
    const service = new window.google.maps.DistanceMatrixService();
    const distanceMatrixConditions = {
      origins: [state.originAddress],
      destinations: [place.name] as string[],
      travelMode: window.google.maps.TravelMode.WALKING
    };

    return new Promise(resolve => {
      service.getDistanceMatrix(distanceMatrixConditions, res => {
        if (!res) return;

        const data = res.rows[0].elements[0];
        const distanceDataObj: {
          distance: number | undefined;
          duration: string | undefined;
        } = {
          distance: undefined,
          duration: undefined
        };
        if (data.status === 'OK') {
          distanceDataObj.distance = data.distance.value;
          distanceDataObj.duration = data.duration.text;
        }

        resolve(distanceDataObj);
      });
    });
  };

  const handleInputRadius: React.ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault();
    let inputRadius = e.target.value;

    if (inputRadius.match(/[^0-9\.]+/)) {
      setErrorMessages({
        ...state.errorMessages,
        radius: '半角数字で入力してください'
      });
    } else if (inputRadius.match(/\..*\./)) {
      setErrorMessages({
        ...state.errorMessages,
        radius: '整数か小数で入力してください'
      });
    } else {
      const { radius, ...errorMessages } = state.errorMessages;
      setErrorMessages(errorMessages);
    }

    dispatch({
      type: 'SET_RADIUS',
      payload: inputRadius
    });
  }

  const getSearchResults = async () => {
    const originGeocode = await setOriginGeocode();
    return await Promise.all(
      state.targetKeywords.map(keyword => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const nearbyPlaces = fetchNearbyPlaces(originGeocode, keyword);
            resolve(nearbyPlaces);
          }, 1000);
        });
      })
    );
  }

  // 距離を表示用にフォーマットする
  const formatDistanceWithUnit: FormatDistanceWithUnit = distance => {
    if (!distance) return;

    let distanceWithUnit = String(distance);

    if (distance >= 1000) {
      distanceWithUnit = (distance / 1000).toFixed(1) + 'km';
    } else {
      distanceWithUnit += 'm';
    }

    return distanceWithUnit;
  };

  const hasErrorMessages = () => {
    let hasError = false;

    const errorMessagesInArray = Object.entries(state.errorMessages);
    errorMessagesInArray.map(([, value]) => {
      if (value) hasError = true;
    });

    return hasError;
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
        setFreeKeyword,
        addFreeKeywords,
        handleCheckboxChange,
        removeFreeKeyword,
        validateSearchValues,
        handleInputRadius,
        getSearchResults,
        formatDistanceWithUnit,
        hasErrorMessages
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchState;
