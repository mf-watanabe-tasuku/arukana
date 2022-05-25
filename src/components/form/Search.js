import { useState, useContext } from 'react';
import Loading from '../layout/Loading';
import CheckboxList from '../form/CheckboxList';
import Places from '../places/Places';
import PlaceContext from '../../context/place/PlaceContext';
import SearchContext from '../../context/search/SearchContext';
import ErrorMessage from './ErrorMessage';

const Home = () => {
  const placeContext = useContext(PlaceContext);
  const { loading, places, setPlaces, clearPlaces, setLoading } = placeContext;
  const searchContext = useContext(SearchContext);
  const { originAddress, originGeocode, setOriginAddress, setOriginGeocode } = searchContext;

  const keywordMaxCount = 4;
  const maxRadius = 5000;
  const minRadius = 50;
  const formattedMaxRadius = maxRadius.toLocaleString();
  const formattedMinRadius = minRadius.toLocaleString();

  const [freeKeyword, setFreeKeyword] = useState('');
  const [freeKeywords, setFreeKeywords] = useState([]);
  const [targetKeywords, setTargetKeywords] = useState([]);
  const [radius, setRadius] = useState(maxRadius);
  const [checkboxes, setCheckboxes] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  const handleCheckboxChange = (e) => {
    const targetValue = e.target.value;
    const { name, checked } = e.target;
    const keywordIndex = targetKeywords.indexOf(targetValue);
    if (checked && keywordIndex === -1) {
      setTargetKeywords([...targetKeywords, targetValue]);
    }
    if (!checked && keywordIndex > -1) {
      targetKeywords.splice(keywordIndex, 1);
      setTargetKeywords([...targetKeywords]);
    }
    setCheckboxes({ ...checkboxes, [name]: checked });
  };

  const addFreeKeywords = (e) => {
    if (e.key !== 'Enter') return;

    if (freeKeywords.length + 1 > keywordMaxCount) {
      setErrorMessages({...errorMessages, keyword: `一度に入力できるのは${keywordMaxCount}個までです` });
      return;
    }

    const targetValue = e.target.value.trim();
    if (freeKeywords.indexOf(targetValue) === -1) {
      setErrorMessages(delete errorMessages.keyword);
    } else {
      setErrorMessages({...errorMessages, keyword: `${targetValue}はすでに入力済みです`});
      return;
    }

    if ( targetValue ) {
      setTargetKeywords([...targetKeywords, freeKeyword]);
      setFreeKeywords([...freeKeywords, freeKeyword]);
      setFreeKeyword('');
    }
  };

  const removeFreeKeyword = (keyword) => {
    const keywordIndex = freeKeywords.indexOf(keyword);
    if (keywordIndex === -1) return;
    freeKeywords.splice(keywordIndex, 1);
    setFreeKeywords([...freeKeywords]);

    const targetKeywordsIndex = targetKeywords.indexOf(keyword);
    if (targetKeywordsIndex === -1) return;
    targetKeywords.splice(targetKeywordsIndex, 1);
    setTargetKeywords([...targetKeywords]);
  };

  const validateSearchValues = () => {
    setErrorMessages({});
    const validationErrors = {};

    if (!originAddress)
      validationErrors.originAddress = '基準地点を入力してください';
    if (targetKeywords.length === 0)
      validationErrors.keyword = '検索する施設を選択または入力してください';
    if (!radius) {
      validationErrors.radius = '検索したい半径距離を入力してください';
    } else if (radius > maxRadius) {
      validationErrors.radius =  `半径${formattedMaxRadius}mより大きな値は指定できません`;
    } else if (radius < minRadius) {
      validationErrors.radius = `半径${formattedMinRadius}m未満は指定できません`;
    } else if (String(radius).match(/\D+/)) {
      validationErrors.radius = '半角数字で入力してください';
    }
    if (validationErrors.originAddress || validationErrors.keyword || validationErrors.radius) {
      validationErrors.notice = '入力内容を確認してください';
    }

    setErrorMessages(validationErrors);

    return validationErrors;
  };

  // 基準地点の座標を取得する
  const fetchOriginGeocode = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const originGeocode = await geocoder.geocode(
      { address: originAddress },
      (results, status) => (status === 'OK' ? results : status)
    );

    const formattedOriginGeocode = {
      lat: originGeocode.results[0].geometry.location.lat(),
      lng: originGeocode.results[0].geometry.location.lng(),
    };

    setOriginGeocode(formattedOriginGeocode);

    return formattedOriginGeocode;
  };

  // 周辺の施設を検索する
  const fetchNearbyPlaces = (geocode, keyword) => {
      const div = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(div);
      const searchConditions = {
        location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
        radius,
        keyword,
      };

      return new Promise(resolve => {
        service.nearbySearch(searchConditions, async (nearbyPlaces) => {
          const formattedNearbyPlaces = nearbyPlaces.map((nearbyPlace) => {
            return {
              name: nearbyPlace.name,
              rating: nearbyPlace.rating,
              ratings_total: nearbyPlace.user_ratings_total,
              lat: nearbyPlace.geometry.location.lat(),
              lng: nearbyPlace.geometry.location.lng(),
            };
          });

          const placeDistanceData = await getPlaceDistanceData(formattedNearbyPlaces);
          const keywordWithPlaces = {
            keyword,
            ...placeDistanceData
          }

          resolve(keywordWithPlaces);
        });
    });
  }

  const getPlaceDistanceData = async (places) => {
    const placesWithDistance = await Promise.all(
      places.map(async (place) => {
        const distanceData = await fetchDistanceData(place);

        let placeWithDistanceObj = {};
        if (distanceData.distance <= radius) {
          placeWithDistanceObj = {
            name: place.name,
            rating: place.rating,
            ratings_total: place.ratings_total,
            geocode: { lat: place.lat, lng: place.lng },
            ...distanceData
          }
        }
        return placeWithDistanceObj;
      })
    );

    const sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance);
    const [nearestPlace, ...nearbyPlaces] = sortedPlaces.slice(0, 4);
    const placeDistanceData = { nearestPlace, nearbyPlaces };

    return placeDistanceData;
  };

  // 距離と所要時間を取得してオブジェクトで返す
  const fetchDistanceData = (destination) => {
    const service = new window.google.maps.DistanceMatrixService();

    const distanceMatrixConditions = {
      origins: [originAddress],
      destinations: [destination],
      travelMode: window.google.maps.TravelMode.WALKING,
    };

    return new Promise((resolve) => {
      service.getDistanceMatrix(distanceMatrixConditions, (res, status) => {
        const data = res.rows[0].elements;
        const distanceDataObj = {
          distance: data[0].distance.value,
          duration: data[0].duration.text,
        };
        resolve(distanceDataObj);
      });
    });
  };

  const handleInputRadius = (e) => {
    e.preventDefault();
    const inputVal = String(e.target.value).replace(',', '');
    setRadius(inputVal);
  }

  // 検索ボタンを押した時の処理;
  const handleSearch = async (e) => {
    if (e.key === 'Enter') return;
    e.preventDefault();

    const validationErrors = validateSearchValues();
    if (Object.keys(validationErrors).length !== 0) return;

    setLoading(true);

    const originGeocode = await fetchOriginGeocode();
    const resultPlaces = await Promise.all(
      targetKeywords.map(keyword => {
        return new Promise(resolve => {
          setTimeout(() => {
            const nearbyPlaces = fetchNearbyPlaces(originGeocode, keyword);
            resolve(nearbyPlaces);
          }, 1000);
        })
      })
    );

    setLoading(false);
    window.scrollTo(0, 0);
    setPlaces(resultPlaces);
  };

  return places.length > 0 ? (
    <>
      <p className='search-results__origin-text'>
        「{originAddress}」から半径{radius}m以内の検索結果
      </p>
      <>
        <div className='search-results__back-box'>
          <p className='search-results__back-link' onClick={clearPlaces}>
            トップへ戻る
          </p>
        </div>
        <Places places={places} originGeocode={originGeocode} />
        <button className='btn-back' onClick={clearPlaces}>
          トップへ戻る
        </button>
      </>
    </>
  ) : loading ? (
    <Loading />
  ) : (
    <form>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP1</span>
        <p className='search-step__ttl'>調べたい住所を入力</p>
        <input
          className='search-step__input input-origin'
          type='text'
          onChange={(e) => setOriginAddress(e.target.value)}
          value={originAddress}
        />
        <ErrorMessage message={errorMessages.originAddress} />
      </div>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP2</span>
        <p className='search-step__ttl'>検索したい施設を選ぶ</p>
        <p className='search-step__sub-ttl'>選択肢から選ぶ</p>
        <CheckboxList checkboxes={checkboxes} onChange={handleCheckboxChange} />
        <p className='search-step__sub-ttl'>
          自由に入力する (最大{keywordMaxCount}個)
        </p>
        <input
          type='text'
          className='search-step__input input-keyword'
          placeholder='入力してEnterを押してください  例) セブンイレブン'
          onChange={(e) => setFreeKeyword(e.target.value)}
          onKeyPress={addFreeKeywords}
          value={freeKeyword}
        />
        <ul className='freeKeyword-list'>
          {freeKeywords.map((keyword, i) => (
            <li key={i} className='freeKeyword-item'>
              {keyword}{' '}
              <span
                className='freeKeyword-close-btn'
                onClick={() => removeFreeKeyword(keyword)}
              >
                ×
              </span>
            </li>
          ))}
        </ul>
        <ErrorMessage message={errorMessages.keyword} />
      </div>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP3</span>
        <p className='search-step__ttl'>検索する半径距離</p>
        <input
          type='text'
          className='search-step__input input-radius'
          onChange={handleInputRadius}
          value={radius}
        />
        <span className='search-step__unit'>m</span>
        <span className='search-step__range'>({formattedMinRadius} ~ {formattedMaxRadius}m)</span>
        <ErrorMessage message={errorMessages.radius} />
      </div>
      <input type='button' onClick={handleSearch} value='検索する' className='btn-search' />
      <ErrorMessage message={errorMessages.notice} className='text-center' />
    </form>
  );
};

export default Home;
