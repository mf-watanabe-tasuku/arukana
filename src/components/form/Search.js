import { useState, useContext } from 'react';
import Loading from '../layout/Loading';
import CheckboxList from '../form/CheckboxList';
import Places from '../places/Places';
import PlaceContext from '../../context/place/placeContext';
import SearchContext from '../../context/search/searchContext';
import ErrorText from './ErrorText';

const Home = () => {
  const placeContext = useContext(PlaceContext);
  const { loading, places, setPlaces, clearPlaces, setLoading } = placeContext;
  const searchContext = useContext(SearchContext);
  const { originAddress, originGeocode, setOriginAddress, setOriginGeocode } = searchContext;

  const errorMessages = {};
  const textKeywordMaxLength = 4;
  const maxRadius = 5000;
  const minRadius = 50;
  const formattedMaxRadius = maxRadius.toLocaleString('en');
  const formattedMinRadius = minRadius.toLocaleString('en');

  const [textKeyword, setTextKeyword] = useState('');
  const [textKeywords, setTextKeywords] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [radius, setRadius] = useState(maxRadius);
  const [checkboxes, setCheckboxes] = useState({});
  const [errors, setErrors] = useState({});

  const handleCheckboxChange = (e) => {
    const targetValue = e.target.value;
    const { name, checked } = e.target;
    const searchKeywordIndex = searchKeywords.indexOf(targetValue);
    if (checked && searchKeywordIndex === -1) {
      setSearchKeywords([...searchKeywords, targetValue]);
    }
    if (!checked && searchKeywordIndex > -1) {
      searchKeywords.splice(searchKeywordIndex, 1);
      setSearchKeywords([...searchKeywords]);
    }
    setCheckboxes({ ...checkboxes, [name]: checked });
  };

  const addKeyword = (e) => {
    if (e.key !== 'Enter') return;

    if (textKeywords.length + 1 > textKeywordMaxLength) {
      const newErrors = {...errors, keyword: `一度に入力できるのは${textKeywordMaxLength}個までです` };
      setErrors(newErrors);

      return;
    }

    const targetValue = e.target.value;
    if (textKeywords.indexOf(targetValue) > -1) {
      setErrors({
        keyword: `${targetValue}はすでに入力済みです`,
      });
      return;
    }

    if ( targetValue.trim() ) {
      setSearchKeywords([...searchKeywords, textKeyword]);
      setTextKeywords([...textKeywords, textKeyword]);
      setTextKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    const searchKeywordIndex = searchKeywords.indexOf(keyword);
    if (searchKeywordIndex === -1) return;
    searchKeywords.splice(searchKeywordIndex, 1);
    setSearchKeywords([...searchKeywords]);
    const textKeywordsIndex = textKeywords.indexOf(keyword);
    if (textKeywordsIndex === -1) return;
    textKeywords.splice(textKeywordsIndex, 1);
    setTextKeywords([...textKeywords]);
  };

  const setValidationMessages = () => {
    if (!originAddress)
      errorMessages['originAddress'] = '基準地点を入力してください';
    if (searchKeywords.length === 0)
      errorMessages['keyword'] = '検索する施設を選択または入力してください';
    if (!radius) {
      errorMessages['radius'] = '検索したい半径距離を入力してください';
    } else if (radius > maxRadius) {
      errorMessages['radius'] =  `半径${formattedMaxRadius}mより大きな値は指定できません`;
    } else if (radius < minRadius) {
      errorMessages['radius'] = `半径${formattedMinRadius}m未満は指定できません`;
    } else if (String(radius).match(/\D+/)) {
      errorMessages['radius'] = '半角数字で入力してください';
    }

    setErrors(errorMessages);

    return errorMessages;
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
  const fetchNearbyPlaces = async (geocode, keyword) => {
    const div = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(div);
    const searchConditions = {
      location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
      radius,
      keyword,
    };

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

      setLoading(false);
      window.scrollTo(0, 0);
      setPlaces(keywordWithPlaces);
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

    const filteredPlaces = placesWithDistance.filter(place => place)
    const sortedPlaces = filteredPlaces.sort((a, b) => a.distance - b.distance);
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

    setErrors({});
    const errorMessages = setValidationMessages();
    const hasError = Object.keys(errorMessages).length > 0;
    if (hasError) {
      errorMessages['notice'] = '入力内容を確認してください';
      setErrors(errorMessages);
      return;
    }

    setLoading(true);

    const originGeocode = await fetchOriginGeocode();

    for(const searchKeyword of searchKeywords) {
      setTimeout(() => {
        fetchNearbyPlaces(originGeocode, searchKeyword);
      }, 1000);
    };
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
        <ErrorText message={errors.originAddress} />
      </div>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP2</span>
        <p className='search-step__ttl'>検索したい施設を選ぶ</p>
        <p className='search-step__sub-ttl'>選択肢から選ぶ</p>
        <CheckboxList checkboxes={checkboxes} onChange={handleCheckboxChange} />
        <p className='search-step__sub-ttl'>
          自由に入力する (最大{textKeywordMaxLength}個)
        </p>
        <input
          type='text'
          className='search-step__input input-keyword'
          placeholder='入力してEnterを押してください  例) セブンイレブン'
          onChange={(e) => setTextKeyword(e.target.value)}
          onKeyPress={addKeyword}
          value={textKeyword}
        />
        <ul className='textKeyword-list'>
          {textKeywords.map((keyword, i) => (
            <li key={i} className='textKeyword-item'>
              {keyword}{' '}
              <span
                className='textKeyword-close-btn'
                onClick={() => removeKeyword(keyword)}
              >
                ×
              </span>
            </li>
          ))}
        </ul>
        <ErrorText message={errors.keyword} />
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
        <ErrorText message={errors.radius} />
      </div>
      <input type='button' onClick={handleSearch} value='検索する' className='btn-search' />
      <ErrorText message={errors.notice} className='text-center' />
    </form>
  );
};

export default Home;
