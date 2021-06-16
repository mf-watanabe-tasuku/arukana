import { useState, useEffect } from "react";
import ResultList from "./components/resultList";
import InputLabel from "./components/inputLabel";
import InputForm from "./components/inputForm";
import CheckboxList from "./components/checkboxList";
import ErrorText from "./components/errorText";
import SearchBtn from "./components/searchBtn";
import "./styles/App.css";

const App = () => {
  const errorMessages = {};
  const searchResults = [];

  const [origin, setOrigin] = useState("東京都世田谷区経堂5-15-1");
  const [keywords, setKeywords] = useState([]);
  const [radius, setRadius] = useState("");
  const [checkboxes, setCheckboxes] = useState({});
  const [places, setPlaces] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    googleMapScript.async = true;
    document.body.appendChild(googleMapScript);
  }, []);

  const handleOriginChange = (e) => setOrigin(e.target.value);

  const handleCheckboxChange = (e) => {
    const targetValue = e.target.value;
    const { name, checked } = e.target;

    if (checked && !keywords.includes(targetValue)) {
      setKeywords([...keywords, targetValue]);
    } else if (!checked && keywords.includes(targetValue)) {
      const filteredKeywords = keywords.filter(
        (keyword) => keyword !== targetValue
      );
      setKeywords(filteredKeywords);
    }
    setCheckboxes({ ...checkboxes, [name]: checked });
  };

  const handleRadiusChange = (e) => setRadius(e.target.value);

  // 検索ボタンを押した時の処理;
  const handleSearch = async (e) => {
    e.preventDefault();

    setValidationMessages();
    const errorExists = Object.keys(errorMessages).length !== 0;
    if (errorExists) return;

    const originGeocode = await getOriginGeocode();

    await Promise.all(
      keywords.map(async (keyword) => {
        await getNearbyPlaces(originGeocode, keyword);
      })
    );

    setPlaces(searchResults);
  };

  const setValidationMessages = () => {
    if (!origin) errorMessages["origin"] = "基準地点を入力してください";
    if (keywords.length === 0)
      errorMessages["place"] = "検索する施設を選択してください";
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
    const originGeocode = await geocoder.geocode(
      { address: origin },
      (results, status) => (status == "OK" ? results : status)
    );

    return {
      lat: originGeocode.results[0].geometry.location.lat(),
      lng: originGeocode.results[0].geometry.location.lng(),
    };
  };

  // 周辺の施設を検索する
  const getNearbyPlaces = async (origin, keyword) => {
    return new Promise((resolve, reject) => {
      const searchConditions = {
        location: new window.google.maps.LatLng(origin.lat, origin.lng),
        radius: radius,
        keyword: keyword,
      };

      const div = document.createElement("div");
      const service = new window.google.maps.places.PlacesService(div);

      service.nearbySearch(searchConditions, async (results, status) => {
        const formattedPlaces = results.map((result) => {
          return {
            name: result.name,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          };
        });
        const nearestPlaceData = await getNearestPlaceData(
          keyword,
          origin,
          formattedPlaces
        );

        searchResults.push(nearestPlaceData);
        resolve();
      });
    });
  };

  // 検索結果から最寄りの施設を絞り込む
  const getNearestPlaceData = async (keyword, origin, places) => {
    let nearestPlace, nearestDistance, nearestDuration;

    for (let i = 0; i < places.length; i++) {
      const [placeDistance, placeDuration] = await getDistanceData(
        origin,
        places[i]
      );
      if (placeDistance > radius) {
        continue;
      } else if (nearestPlace == null || nearestDistance > placeDistance) {
        nearestPlace = places[i].name;
        nearestDistance = placeDistance;
        nearestDuration = placeDuration;
      }
    }

    const nearestPlaceData = {
      keyword: keyword,
      name: nearestPlace,
      distance: nearestDistance,
      duration: nearestDuration,
    };
    return nearestPlaceData;
  };

  // 距離と所要時間を取得してオブジェクトで返す
  const getDistanceData = async (origin, destination) => {
    const service = new window.google.maps.DistanceMatrixService();
    const response = await service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: window.google.maps.TravelMode.WALKING,
    });

    const data = response.rows[0].elements;
    const distance = data[0].distance.value;
    const duration = data[0].duration.text;

    return [distance, duration];
  };

  return (
    <>
      <div className="input-row">
        <InputLabel id="origin" text="基準となる場所" />
        <InputForm id="origin" value={origin} onChange={handleOriginChange} />
        <ErrorText message={errors.origin} />
      </div>
      <div className="input-row">
        <InputLabel id="keyword" text="検索したい施設名" />
        <CheckboxList onChange={handleCheckboxChange} />
        <ErrorText message={errors.place} />
      </div>
      <div className="input-row">
        <InputLabel id="radius" text="検索する半径距離" />
        <InputForm id="radius" value={radius} onChange={handleRadiusChange} />
        <ErrorText message={errors.radius} />
      </div>

      <SearchBtn onClick={handleSearch} />

      {places.length > 0 && <ResultList results={places} />}
    </>
  );
};

export default App;
