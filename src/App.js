import { useState, useEffect } from "react";
import Header from "./components/header";
import ResultList from "./components/resultList";
import CheckboxList from "./components/checkboxList";
import ErrorText from "./components/errorText";
import SearchBtn from "./components/searchBtn";
import BackToTopBtn from "./components/backToTopBtn";
import "./styles/App.css";

const App = () => {
  const errorMessages = {};
  let searchResults = [];

  const [origin, setOrigin] = useState("");
  const [originGeocode, setOriginGeocode] = useState({});
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

    if (textKeywords.length + 1 > 4) {
      setErrors({
        ...errors,
        keyword: "一度に入力できるのは4個までです",
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

    if (searchKeywords.length > 10) {
      alert("検索する施設は8個以内にしてください");
      return;
    }

    const errorExists = Object.keys(errorMessages).length !== 0;
    if (errorExists) return;

    const geocode = await getOriginGeocode();
    setOriginGeocode(geocode);

    const searchRadius = radius.replace(",", "");
    if (searchRadius.match(/\D+/)) {
      setErrors({ ...errors, radius: "半角数字で入力してください" });
      return;
    }

    await Promise.all(
      searchKeywords.map(async (keyword) => {
        await getNearbyPlaces(geocode, keyword, searchRadius);
      })
    );

    setPlaces(searchResults);
    window.scrollTo(0, 0);
  };

  const setValidationMessages = () => {
    if (!origin) errorMessages["origin"] = "基準地点を入力してください";

    if (searchKeywords.length === 0)
      errorMessages["keyword"] = "検索する施設を選択または入力してください";

    if (radius > 3000) {
      errorMessages["radius"] = "半径5000mより大きな値は指定できません";
    } else if (radius && radius < 50) {
      errorMessages["radius"] = "半径50m未満は指定できません";
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
    return service
      .getDistanceMatrix({
        origins: [origin],
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
        console.log("Error: " + err.message);
      });
  };

  const handleBackToTop = () => {
    setPlaces([]);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header />
      <main>
        <div className="wrapper">
          {places.length > 0 ? (
            <>
              <p className="search-results__origin-text">
                「{origin}」から半径
                {radius || process.env.REACT_APP_DEFAULT_SEARCH_RADIUS}
                m以内の検索結果
              </p>
              <div className="search-results__back-box">
                <p
                  className="search-results__back-link"
                  onClick={handleBackToTop}
                >
                  トップへ戻る
                </p>
              </div>
              <ResultList originGeocode={originGeocode} places={places} />
              <BackToTopBtn onClick={handleBackToTop} />
            </>
          ) : (
            <>
              <div className="search-step__list">
                <div className="search-step__item input-row">
                  <span className="search-step__num">STEP1</span>
                  <p className="search-step__ttl">
                    調べたい住所を入力してください
                  </p>
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
                  <p className="search-step__ttl">
                    検索したい施設を選んでください
                  </p>
                  <p className="search-step__sub-ttl">選択肢から選ぶ</p>
                  <CheckboxList
                    checkboxes={checkboxes}
                    onChange={handleCheckboxChange}
                  />
                  <p className="search-step__sub-ttl">
                    自由に入力する (最大4個)
                  </p>
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
                  <span className="search-step__range">(50 ~ 3,000m)</span>
                  <ErrorText message={errors.radius} />
                  <p className="search-step__info-text">
                    ※未入力の場合は半径3,000mで検索されます。
                  </p>
                </div>
              </div>

              <SearchBtn onClick={handleSearch} />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default App;
