import { useEffect, useRef, useContext } from 'react';
import SearchContext from '../context/search/SearchContext';
import {
  faSmile,
  faMapMarkerAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import star_100 from '../images/star_100.svg';
import star_75 from '../images/star_75.svg';
import star_50 from '../images/star_50.svg';
import star_25 from '../images/star_25.svg';
import star_0 from '../images/star_0.svg';
import '../styles/Result.css';

const Result = ({ result }) => {
  const { keyword, nearestPlace, nearbyPlaces } = result;
  const { name, rating, reviewCount, distance, duration, geocode } =
    nearestPlace;

  const { originGeocode } = useContext(SearchContext);

  const map = useRef(null);

  useEffect(() => {
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

    const calculateAndDisplayRoute = (
      directionsService,
      directionsRenderer
    ) => {
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
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    };

    drawMap();
  }, [originGeocode, geocode]);

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (distance) => {
    if (distance >= 1000) {
      distance = (distance / 1000).toFixed(1) + 'km';
    } else {
      distance += 'm';
    }

    return distance;
  };

  const getRatingStars = () => {
    if (!rating) return;

    let ratingStars = [];
    for (let i = 1; i <= rating; i++) {
      ratingStars.push(star_100);
    }

    const remaining = (rating * 10) % 10;
    if (0 < remaining && remaining < 3) {
      ratingStars.push(star_25);
    } else if (3 <= remaining && remaining < 8) {
      ratingStars.push(star_50);
    } else if (8 <= remaining) {
      ratingStars.push(star_75);
    }

    while (ratingStars.length < 5) {
      ratingStars.push(star_0);
    }

    return ratingStars;
  };

  return (
    <>
      <p className='result-item-keyword'>
        <b>最寄りの{keyword}</b>
      </p>
      <li className='result-item'>
        <div className='result-item-data-box'>
          {nearestPlace && (
            <div>
              <p className='result-item-title'>{name}</p>
              <ul className='data-list'>
                <li className='data-list-item rating-box'>
                  <span className='rating-icon'>
                    <FontAwesomeIcon icon={faSmile} />
                  </span>
                  {rating ? (
                    <>
                      <span className='rating-num'>{rating}</span>
                      <span className='rating-star-list'>
                        {getRatingStars() &&
                          getRatingStars().map((star, i) => (
                            <img
                              key={i}
                              src={star}
                              className='rating-star-item'
                              alt='Rating Star'
                            />
                          ))}
                      </span>
                      <span>({reviewCount})</span>
                    </>
                  ) : (
                    'まだ評価がありません'
                  )}
                </li>
                <li className='data-list-item'>
                  <span className='rating-icon'>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                  <span>距離 : </span>
                  <span>{getDisplayDistance(distance)}</span>
                </li>
                <li className='data-list-item'>
                  <span className='rating-icon'>
                    <FontAwesomeIcon icon={faClock} />
                  </span>
                  <span>所要時間(徒歩) : </span>
                  <span>{duration}</span>
                </li>
              </ul>
            </div>
          )}
          {nearbyPlaces.length > 0 && (
            <div className='other-results__box'>
              <p className='other-results__title'>検索にヒットした場所</p>
              <ul className='other-results__list'>
                {nearbyPlaces.map((place, i) => (
                  <li key={i} className='other-results__item'>
                    {place.name} ( {getDisplayDistance(place.distance)} /{' '}
                    {place.duration} )
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className='result-item-map'>
          <div id='map' ref={map}></div>
        </div>
      </li>
    </>
  );
};

export default Result;
