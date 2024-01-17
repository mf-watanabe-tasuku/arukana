import { styled } from 'styled-components';
import {
  GetOriginGeocode,
  FetchDistanceData,
  FormattedNearbyPlace,
  GetSearchResults,
  HasErrorMessages,
  FetchNearbyPlaces
} from '../../types';
import { useForm } from '../../context/FormContext';
import { useLoading } from '../../context/LoadingContext';
import { useResults } from '../../context/ResultsContext';

const StyledBtnSearch = styled.button`
  width: 300px;
  max-width: 100%;
  padding: 12px 0;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.1em;
  background-color: #33aaee;
  box-shadow: 0 6px 0 #006ba3;
  border: none;
  border-radius: 5px;
  margin: 25px auto 15px;
  display: block;
  cursor: pointer;
  transition-duration: 0.3s;

  @media (max-width: 767px) {
    margin-top: 20px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const FormSubmit: React.FC = () => {
  const { setResults } = useResults();
  const { setLoading } = useLoading();
  const {
    originAddress,
    radius,
    targetKeywords,
    setOriginGeocode,
    setRadius,
    setErrorMessages
  } = useForm();

  /**
   * フォーム入力値のバリデーションを行う関数
   * @return {ErrorMessage[]} validationErrors - バリデーションエラーオブジェクト
   */
  const validateForm = () => {
    const validationErrors = {
      originAddress: '',
      keyword: '',
      radius: ''
    };

    // 基準地点が空の場合はエラー
    if (!originAddress)
      validationErrors.originAddress = '基準地点を入力してください';

    // 検索対象のキーワードが空の場合はエラー
    if (targetKeywords.length === 0)
      validationErrors.keyword = '検索する施設を選択または入力してください';

    // 半径距離が空の場合はエラー
    if (!radius) {
      validationErrors.radius = '検索したい半径距離を入力してください';
    // 半径距離が半角数字以外の場合、または半角数字を含まない場合(ピリオドのみ)はエラー
    } else if (String(radius).match(/[^0-9\.]+/) || !String(radius).match(/[0-9]+/)) {
      validationErrors.radius = '半角数字で入力してください';
    // 半径距離が小数点を複数個含む場合はエラー
    } else if (String(radius).match(/\..*\./)) {
      validationErrors.radius = '整数か小数で入力してください';
    } else {
      // stateに保持している半径距離をStringからFloatに変換
      const radiusInFloat = parseFloat(String(radius));

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

  /**
   * 基準地点の座標を取得する関数
   * @return {Geocode} formattedGeocode - 整形された緯度・経度オブジェクト
   */
  const getOriginGeocode: GetOriginGeocode = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const originGeocode = await geocoder.geocode(
      { address: originAddress },
      (results, status) => (status === 'OK' ? results : status)
    );

    const formattedGeocode = {
      lat: originGeocode.results[0].geometry.location.lat(),
      lng: originGeocode.results[0].geometry.location.lng(),
    };

    return formattedGeocode;
  };

  /**
   * 周辺施設の検索結果を取得する関数
   * @return {Promise}
   */
  const getSearchResults: GetSearchResults = async () => {
    const originGeocode = await getOriginGeocode();
    setOriginGeocode(originGeocode);

    const promisesToReturn = await Promise.all(
      targetKeywords.map(keyword => {
        const nearbyPlacesForKeyword = new Promise(resolve => {
          setTimeout(() => {
            const fetchedNearbyPlaces = fetchNearbyPlaces(originGeocode, keyword);
            resolve(fetchedNearbyPlaces);
          }, 1000);
        });
        return nearbyPlacesForKeyword;
      })
    );

    return promisesToReturn;
  }

  /**
   * APIで周辺の施設を検索する関数
   * @param {string} keyword - 検索対象の施設のキーワード
   */
  const fetchNearbyPlaces: FetchNearbyPlaces = (geocode, keyword) => {
    const promiseToReturn = new Promise(resolve => {
      const div = document.createElement('div');
      const placesService = new window.google.maps.places.PlacesService(div);
      const searchConditions = {
        location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
        radius: Number(radius),
        keyword
      };

      placesService.nearbySearch(searchConditions, async nearbyPlaces => {
        const formattedNearbyPlaces: FormattedNearbyPlace[] | undefined = nearbyPlaces?.map(nearbyPlace => {
          return {
            name: nearbyPlace.name,
            rating: nearbyPlace.rating,
            ratings_total: nearbyPlace.user_ratings_total,
            lat: nearbyPlace?.geometry?.location?.lat(),
            lng: nearbyPlace?.geometry?.location?.lng()
          };
        });

        const placeAndDistanceData = await getPlaceAndDistanceData(formattedNearbyPlaces);
        const resultToReturn = {
          keyword,
          ...placeAndDistanceData
        };

        resolve(resultToReturn);
      });
    });

    return promiseToReturn;
  };

  /**
   * 基準地点からの距離と所要時間を取得する関数
   * @param {FormattedNearbyPlace[] | undefined} places - 検索結果の施設
   * @return {{NearestPlace, NearbyPlaces}} placeDistanceData - 周辺施設データをまとめたオブジェクト
   */
  const getPlaceAndDistanceData = async (places: FormattedNearbyPlace[] | undefined) => {
    if (!places) return;

    const placesWithDistance = await Promise.all(
      places.map(async place => {
        const fetchedDistanceData = await fetchDistanceData(place);

        const placeWithDistanceObj = {
          name: place.name,
          rating: place.rating,
          reviewCount: place.ratings_total,
          geocode: { lat: place.lat, lng: place.lng },
          ...fetchedDistanceData
        };
        return placeWithDistanceObj;
      })
    );

    const filteredResults = placesWithDistance.filter(place => {
      return place.distance && place.distance <= Number(radius);
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
  const fetchDistanceData: FetchDistanceData = (place) => {
    const service = new window.google.maps.DistanceMatrixService();
    const distanceMatrixConditions = {
      origins: [originAddress],
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

  /**
 * エラーメッセージがあるかどうかを判定する関数
 * @param {object} messages - エラーメッセージ
 * @return {boolean} hasError - エラーメッセージがあるかどうか
 */
  const hasErrorMessages: HasErrorMessages = messages => {
    let hasError = false;

    const errorMessagesInArray = Object.entries(messages);
    errorMessagesInArray.map(([, value]) => {
      if (value) hasError = true;
    });

    return hasError;
  }

  // 検索ボタンを押した時の処理
  const handleSubmit = async () => {
    // 検索条件のバリデーションを行い、返却された結果をerrorMessages stateにセット
    const validationErrors = validateForm();
    setErrorMessages(validationErrors);

    // エラーがある場合は検索処理を中断
    const hasError = hasErrorMessages(validationErrors);
    if (hasError) return;

    setLoading(true);
    window.scrollTo(0, 0);
    const results = await getSearchResults();

    // 検索結果をResultsContextにセット
    setResults(results);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  }

  return(
    <StyledBtnSearch type='button' onClick={handleSubmit} onKeyDown={handleKeyDown}>
      検索する
    </StyledBtnSearch>
  )
}


export default FormSubmit;
