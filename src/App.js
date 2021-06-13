import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [origin, setOrigin] = useState("東京都世田谷区経堂5-15-1");
  const [radius, setRadius] = useState(1000);
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: true,
    checkbox2: true,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
  });

  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    googleMapScript.async = true;
    document.body.appendChild(googleMapScript);
  }, []);

  // 検索ボタンを押した時の処理;
  const handleSearch = async (e) => {
    e.preventDefault();

    removeListContents();

    const originGeocode = await getOriginGeocode();
    const keywords = getCheckboxValues();

    keywords.map(
      async (keyword) => await getNearbyPlaces(originGeocode, keyword)
    );
  };

  // 検索結果を空にする
  const removeListContents = () => {
    let ul = document.getElementById("result");
    while (ul.lastChild) ul.removeChild(ul.lastChild);
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

  // 検索keywordを取得してフォーマットする
  const getCheckboxValues = () => {
    const keywordsNodeList = document.getElementsByClassName("placeCheckbox");
    const keywordsArray = Array.prototype.slice.call(keywordsNodeList);
    const keywords = keywordsArray
      .filter((keyword) => keyword.checked)
      .map((keyword) => keyword.value);
    return keywords;
  };

  // 周辺の施設を検索する
  const getNearbyPlaces = async (origin, keyword) => {
    const radius = parseInt(document.getElementById("radius").value);
    if (radius > 3000) {
      displayError("半径距離は3000m以下に設定してください");
      return;
    }

    const searchConditions = {
      location: new window.google.maps.LatLng(origin.lat, origin.lng),
      radius: radius,
      keyword: keyword,
    };

    const div = document.createElement("div");
    const service = new window.google.maps.places.PlacesService(div);

    service.nearbySearch(searchConditions, async (results, status) => {
      const places = results.map((result) => {
        return {
          name: result.name,
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        };
      });
      const nearestPlaceData = await getNearestPlaceData(origin, places);
      displayResult(keyword, ...nearestPlaceData);
    });
  };

  // 検索結果から最寄りの施設を絞り込む
  const getNearestPlaceData = async (origin, places) => {
    let nearestPlace, nearestDistance, nearestDuration;

    for (let i = 0; i < places.length; i++) {
      const [placeDistance, placeDuration] = await getDistanceData(
        origin,
        places[i]
      );
      if (nearestPlace == null || nearestDistance > placeDistance) {
        nearestPlace = places[i].name;
        nearestDistance = placeDistance;
        nearestDuration = placeDuration;
      }
    }

    const nearestPlaceData = [nearestPlace, nearestDistance, nearestDuration];
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

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (value) => {
    if (value >= 1000) {
      value /= 1000.0;
      value = Math.round(value * 10) / 10.0;
      value += "km";
    } else {
      value += "m";
    }

    return value;
  };

  // 検索結果を表示する
  const displayResult = (keyword, name, distance, duration) => {
    const result = document.getElementById("result");
    const li = document.createElement("li");

    const formatDistance = getDisplayDistance(distance);

    const hasResultText = `最寄りの${keyword}: <b>${name}</b> (距離: ${formatDistance} / 所要時間: ${duration})`;
    const noResultText = `${keyword}は見つかりませんでした`;

    const text = name ? hasResultText : noResultText;

    li.innerHTML = text;
    result.appendChild(li);
  };

  const displayError = (text) => {
    const error = document.getElementById("radiusError");
    error.textContent = text;
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes({ ...checkboxes, [name]: checked });
  };

  return (
    <>
      <div>
        <label htmlFor="place">基準となる場所: </label>
        <input
          type="text"
          id="place"
          onChange={(e) => setOrigin(e.target.value)}
          value={origin}
        />
      </div>
      <div>
        <label htmlFor="keyword">検索したい施設名: </label>
        {/* <input type="text" id="keyword" name="keyword" value="スターバックス" /> */}
        <ul className="place__checkbox-list">
          <li className="place__checkbox-item">
            <input
              type="checkbox"
              className="placeCheckbox"
              name="checkbox1"
              value="スターバックス"
              id="starbucks"
              onChange={(e) => handleCheckboxChange(e)}
              checked={checkboxes.checked1}
            />
            <label htmlFor="starbucks">スターバックス</label>
          </li>
          <li className="place__checkbox-item">
            <input
              type="checkbox"
              className="placeCheckbox"
              name="checkbox2"
              value="タリーズ"
              id="tullys"
              onChange={(e) => handleCheckboxChange(e)}
              checked={checkboxes.checked2}
            />
            <label htmlFor="tullys">タリーズコーヒー</label>
          </li>
          <li className="place__checkbox-item">
            <input
              type="checkbox"
              className="placeCheckbox"
              name="checkbox3"
              value="ドトール"
              id="doutor"
              onChange={(e) => handleCheckboxChange(e)}
              checked={checkboxes.checked3}
            />
            <label htmlFor="doutor">ドトール</label>
          </li>
          <li className="place__checkbox-item">
            <input
              type="checkbox"
              className="placeCheckbox"
              name="checkbox4"
              value="ジム"
              id="gym"
              onChange={(e) => handleCheckboxChange(e)}
              checked={checkboxes.checked4}
            />
            <label htmlFor="gym">ジム</label>
          </li>
          <li className="place__checkbox-item">
            <input
              type="checkbox"
              className="placeCheckbox"
              name="checkbox5"
              value="郵便局"
              id="postOffice"
              onChange={(e) => handleCheckboxChange(e)}
              checked={checkboxes.checked5}
            />
            <label htmlFor="postOffice">郵便局</label>
          </li>
        </ul>
      </div>
      <div>
        <label htmlFor="radius">検索する半径距離: </label>
        <input
          type="text"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        <p id="radiusError" className="error"></p>
      </div>

      <button id="submit" onClick={handleSearch}>
        検索
      </button>

      <ul id="result"></ul>
    </>
  );
};

export default App;
