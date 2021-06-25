import { useState, useEffect } from "react";
import Header from "./components/header";
import ResultList from "./components/resultList";
import CheckboxList from "./components/checkboxList";
import ErrorText from "./components/errorText";
import SearchBtn from "./components/searchBtn";
import "./styles/App.css";

const App = () => {
  const errorMessages = {};
  let searchResults = [];

  const [origin, setOrigin] = useState("東京都世田谷区経堂5-15-1");
  const [originGeocode, setOriginGeocode] = useState({
    lat: "",
    lng: "",
  });
  const [textKeyword, setTextKeyword] = useState("");
  const [textKeywords, setTextKeywords] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [radius, setRadius] = useState("");
  const [checkboxes, setCheckboxes] = useState({});
  const [places, setPlaces] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    googleMapScript.async = true;
    document.body.appendChild(googleMapScript);
  }, []);

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
    if (e.key !== "Enter") return;

    if (textKeywords.length + 1 > 5) {
      setErrors({
        ...errors,
        keyword: "一度に検索できるのは5個までです",
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
    setTextKeyword("");
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

  // 検索ボタンを押した時の処理;
  const handleSearch = async (e) => {
    e.preventDefault();

    setErrors({});
    setValidationMessages();

    const errorExists = Object.keys(errorMessages).length !== 0;
    if (errorExists) return;

    const geocode = await getOriginGeocode();
    setOriginGeocode(geocode);

    const formattedRadius = radius.replace(",", "");
    const hasFullWidthNum = formattedRadius.match(/\D+/);
    if (hasFullWidthNum) {
      setErrors({ ...errors, radius: "半角数字で入力してください" });
      return;
    }

    await Promise.all(
      searchKeywords.map(async (keyword) => {
        await getNearbyPlaces(geocode, keyword, formattedRadius);
      })
    );

    setPlaces(searchResults);
  };

  const setValidationMessages = () => {
    if (!origin) errorMessages["origin"] = "基準地点を入力してください";
    if (searchKeywords.length === 0)
      errorMessages["keyword"] = "検索する施設を選択または入力してください";
    if (!radius) {
      errorMessages["radius"] = "半径距離を入力してください";
    } else if (radius > 3000) {
      errorMessages["radius"] = "半径3000m以下に設定してください";
    }

    setErrors(errorMessages);
  };

  // 基準地点の座標を取得する
  const getOriginGeocode = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const geocode = await geocoder.geocode(
      { address: origin },
      (results, status) => (status === "OK" ? results : status)
    );

    return {
      lat: geocode.results[0].geometry.location.lat(),
      lng: geocode.results[0].geometry.location.lng(),
    };
  };

  // 周辺の施設を検索する
  const getNearbyPlaces = async (geocode, keyword, radius) => {
    return new Promise((resolve, reject) => {
      const searchConditions = {
        location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
        radius,
        keyword,
      };

      const div = document.createElement("div");
      const service = new window.google.maps.places.PlacesService(div);

      service.nearbySearch(searchConditions, async (results, status) => {
        const formattedPlaces = results.map((result) => {
          return {
            name: result.name,
            rating: result.rating,
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

        const arr = placeArr.sort((a, b) => a.distance - b.distance);
        const slicedArr = arr.slice(0, 4);

        const [nearestPlace, ...otherPlaces] = slicedArr;
        const placeResults = { keyword, nearestPlace, otherPlaces };

        searchResults = [...searchResults, placeResults];

        resolve();
      });
    });
  };

  // 距離と所要時間を取得してオブジェクトで返す
  const getDistanceData = async (destination) => {
    const service = new window.google.maps.DistanceMatrixService();
    const response = await service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: window.google.maps.TravelMode.WALKING,
    });

    const data = response.rows[0].elements;

    return {
      name: destination.name,
      rating: destination.rating,
      distance: data[0].distance.value,
      duration: data[0].duration.text,
    };
  };

  return (
    <>
      <Header />
      <div className="search-step__list">
        <div className="search-step__item input-row">
          <span className="search-step__num">STEP1</span>
          <p className="search-step__ttl">調べたい住所を入力してください</p>
          <input
            className="search-step__input"
            type="text"
            onChange={(e) => setOrigin(e.target.value)}
            value={origin}
          />
          <ErrorText message={errors.origin} />
        </div>
        <div className="search-step__item input-row">
          <span className="search-step__num">STEP2</span>
          <p className="search-step__ttl">検索したい施設を選んでください</p>
          <p className="search-step__sub-ttl">選択肢から選ぶ</p>
          <CheckboxList onChange={handleCheckboxChange} />
          <p className="search-step__sub-ttl">自由に入力する (最大5個)</p>
          <input
            type="text"
            className="search-step__input input-keyword"
            placeholder="入力してEnterを押してください  例) セブンイレブン"
            onChange={(e) => setTextKeyword(e.target.value)}
            onKeyPress={addKeyword}
            value={textKeyword}
          />
          <ErrorText message={errors.keyword} />
          <ul className="textKeyword-list">
            {textKeywords.map((keyword, i) => (
              <li key={i} className="textKeyword-item">
                {keyword}{" "}
                <span
                  className="textKeyword-close-btn"
                  onClick={() => removeKeyword(keyword)}
                >
                  ×
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="search-step__item input-row">
          <span className="search-step__num">
            STEP3<span> (任意)</span>
          </span>
          <p className="search-step__ttl">検索する半径距離</p>
          <input
            type="text"
            className="search-step__input input-radius"
            onChange={(e) => setRadius(e.target.value)}
            value={radius}
          />
          <span className="search-step__unit">m</span>
          <span className="search-step__range">(0 ~ 3,000m)</span>
          <ErrorText message={errors.radius} />
          <p className="search-step__info-text">
            ※未入力の場合は半径2,000mで検索されます。
          </p>
        </div>
      </div>

      <SearchBtn onClick={handleSearch} />

      {places.length > 0 && (
        <ResultList originGeocode={originGeocode} places={places} />
      )}
    </>
  );
};

export default App;
