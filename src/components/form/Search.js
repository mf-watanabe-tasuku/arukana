import React, { Fragment, useState, useContext, useReducer } from 'react';
import Loading from '../layout/Loading';
import CheckboxList from '../form/CheckboxList';
import Places from '../places/Places';
import PlaceContext from '../../context/place/placeContext';
import SearchContext from '../../context/search/searchContext';

const Home = () => {
  const placeContext = useContext(PlaceContext);
  const { loading, places, clearPlaces, setLoading } = placeContext;
  const searchContext = useContext(SearchContext);
  const { setGeocode } = searchContext;

  const errorMessages = {};
  const textKeywordMaxLength = 10;

  const [originAddress, setOriginAddress] = useState('');
  const [textKeyword, setTextKeyword] = useState('');
  const [textKeywords, setTextKeywords] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [radius, setRadius] = useState('3000');
  const [checkboxes, setCheckboxes] = useState({});
  const [errors, setErrors] = useState({});

  const [originGeocode, setOriginGeocode] = useState({});

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
      setErrors({
        ...errors,
        keyword: `一度に入力できるのは${textKeywordMaxLength}個までです`,
      });
      return;
    }
    const targetValue = e.target.value;
    if (textKeywords.indexOf(targetValue) > -1) {
      setErrors({
        ...errors,
        keyword: `${targetValue}はすでに入力済みです`,
      });
      return;
    }
    setSearchKeywords([...searchKeywords, textKeyword]);
    setTextKeywords([...textKeywords, textKeyword]);
    setTextKeyword('');
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
    } else if (radius > 3000) {
      errorMessages['radius'] = '半径5000mより大きな値は指定できません';
    } else if (radius && radius < 50) {
      errorMessages['radius'] = '半径50m未満は指定できません';
    }
    // setErrors(errorMessages);
  };

  // 基準地点の座標を取得する
  const getOriginGeocode = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const geocode = await geocoder.geocode(
      { address: originAddress },
      (results, status) => (status === 'OK' ? results : status)
    );

    const originGeocode = {
      lat: geocode.results[0].geometry.location.lat(),
      lng: geocode.results[0].geometry.location.lng(),
    };

    return originGeocode;
  };

  // 周辺の施設を検索する
  const getNearbyPlaces = (geocode, keyword, radius) => {
    return new Promise((resolve) => {
      const searchConditions = {
        location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
        radius,
        keyword,
      };

      const div = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(div);

      service.nearbySearch(searchConditions, async (results) => {
        const formattedPlaces = results.map((result) => {
          return {
            name: result.name,
            rating: result.rating,
            ratings_total: result.user_ratings_total,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          };
        });

        let placeArr = [];

        await Promise.all(
          formattedPlaces.map(async (place) => {
            let placeData = await getDistanceData(place);
            if (placeData.distance <= radius) {
              placeData = {
                ...placeData,
                geocode: { lat: place.lat, lng: place.lng },
              };
              placeArr = [...placeArr, placeData];
            }
          })
        );

        const sortedPlaces = placeArr.sort((a, b) => a.distance - b.distance);
        const [nearestPlace, ...otherPlaces] = sortedPlaces.slice(0, 4);
        const placeResult = { keyword, nearestPlace, otherPlaces };

        resolve(placeResult);
      });
    });
  };

  // 距離と所要時間を取得してオブジェクトで返す
  const getDistanceData = async (destination) => {
    const service = new window.google.maps.DistanceMatrixService();
    return service
      .getDistanceMatrix({
        origins: [originAddress],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.WALKING,
      })
      .then((res) => {
        const data = res.rows[0].elements;
        return {
          name: destination.name,
          rating: destination.rating,
          ratings_total: destination.ratings_total,
          distance: data[0].distance.value,
          duration: data[0].duration.text,
        };
      })
      .catch((err) => {
        console.log('Error: ' + err.message);
      });
  };

  // 検索ボタンを押した時の処理;
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setErrors({});
    setValidationMessages();
    if (textKeywords.length > textKeywordMaxLength) {
      alert(`自由入力は最大${textKeywordMaxLength}個までです`);
      return;
    }
    const errorExists = Object.keys(errorMessages).length !== 0;
    if (errorExists) return;

    const geocode = await getOriginGeocode();
    setOriginGeocode(geocode);

    setGeocode(geocode);
    const searchRadius = radius.replace(',', '');
    if (searchRadius.match(/\D+/)) {
      // setErrors({ ...errors, radius: "半角数字で入力してください" });
      return;
    }

    let i = 0;
    let results = [];

    const searchKeywordPlaces = () => {
      getNearbyPlaces(geocode, searchKeywords[i], searchRadius).then(
        (placeResult) => {
          results.push(placeResult);
          i++;
          if (i < searchKeywords.length) {
            setTimeout(() => searchKeywordPlaces(), 1000);
          } else {
            setLoading(false);
            window.scrollTo(0, 0);
            placeContext.setPlaces(results);
          }
        }
      );
    };
    searchKeywordPlaces();
  };

  return places.length > 0 ? (
    <>
      <p className='search-results__origin-text'>
        「{originAddress}」から半径
        {radius || process.env.REACT_APP_DEFAULT_SEARCH_RADIUS}
        m以内の検索結果
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
    <form onSubmit={handleSearch}>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP1</span>
        <p className='search-step__ttl'>調べたい住所を入力</p>
        <input
          className='search-step__input input-origin'
          type='text'
          onChange={(e) => setOriginAddress(e.target.value)}
          value={originAddress}
        />
        {/* <ErrorText message={errors.originAddress} /> */}
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
        {/* <ErrorText message={errors.keyword} /> */}
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
      </div>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP3</span>
        <p className='search-step__ttl'>検索する半径距離</p>
        <input
          type='text'
          className='search-step__input input-radius'
          onChange={(e) => setRadius(e.target.value)}
          value={radius}
        />
        <span className='search-step__unit'>m</span>
        <span className='search-step__range'>(50 ~ 3,000m)</span>
        {/* <ErrorText message={errors.radius} /> */}
      </div>
      <input type='submit' value='検索する' className='btn-search' />
    </form>
  );
};

export default Home;
