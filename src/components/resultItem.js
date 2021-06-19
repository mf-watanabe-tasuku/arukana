import { useEffect, useRef } from "react";
import "../styles/ResultItem.css";

const ResultItem = ({ originGeocode, result }) => {
  const { keyword, nearestPlace, otherPlaces } = result;
  const { name, distance, duration, geocode } = nearestPlace;
  const map = useRef(null);

  useEffect(() => {
    drawMap();
  }, []);

  // 検索結果を表示する
  const displayResult = () => {
    const formatDistance = getDisplayDistance(distance);
    const resultText = `${name} ( 距離: ${formatDistance} / 所要時間: ${duration} )`;

    return { __html: resultText };
  };

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (distance) => {
    if (distance >= 1000) {
      distance = (distance / 1000).toFixed(1) + "km";
    } else {
      distance += "m";
    }

    return distance;
  };

  const drawMap = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    const displayMap = new window.google.maps.Map(map.current, {
      zoom: 13,
      center: { lat: originGeocode.lat, lng: originGeocode.lng },
      disableDefaultUI: true,
    });
    directionsRenderer.setMap(displayMap);

    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  const calculateAndDisplayRoute = (directionsService, directionsRenderer) => {
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          originGeocode.lat,
          originGeocode.lng
        ),
        destination: new window.google.maps.LatLng(geocode.lat, geocode.lng),
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };

  return (
    <>
      <p className="result-item-keyword">
        <b>最寄りの{keyword}</b>
      </p>
      <li className="result-item">
        <div className="result-item-data">
          {nearestPlace ? (
            <p dangerouslySetInnerHTML={displayResult()}></p>
          ) : (
            <p>{keyword}は見つかりませんでした</p>
          )}
          {otherPlaces.length > 0 && (
            <div className="otherResults-box">
              <p className="otherResults-title">検索にヒットした場所</p>
              <ul>
                {otherPlaces.map((place, i) => (
                  <li key={i}>
                    {place.name} ( 距離: {getDisplayDistance(place.distance)} /
                    所要時間: {place.duration} )
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="result-item-map">
          <div id="map" ref={map}></div>
          {/* <button onClick={handleClick}>button</button> */}
        </div>
      </li>
    </>
  );
};

export default ResultItem;
