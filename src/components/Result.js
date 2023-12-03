import { useEffect, useRef, useContext } from 'react';
import { styled } from 'styled-components';
import SearchContext from '../context/search/SearchContext';
import { faSmile, faMapMarkerAlt, faClock, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import star_100 from '../images/star_100.svg';
import star_75 from '../images/star_75.svg';
import star_50 from '../images/star_50.svg';
import star_25 from '../images/star_25.svg';
import star_0 from '../images/star_0.svg';

const StyledResult = styled.li`
  background-color: #fff;
  min-height: 250px;
  margin-bottom: 30px;
  border-bottom: 1px solid #999;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1px 5px #c0c0c0;
  padding: 25px 30px;

  @media (max-width: 767px) {
    padding: 20px;
    flex-direction: column;
  }
`;

const StyleResultItemKeyword = styled.p`
  margin-bottom: 5px;
`;

const StyledResultItemDataBox = styled.div`
  width: 51%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledResultItemTitle = styled.p`
  margin-bottom: 15px;
  font-size: 20px;
`;

const StyledDataList = styled.ul`
  margin-bottom: 22px;
  list-style: none;
`;

const StyledResultItemMap = styled.div`
  width: 45%;

  @media (max-width: 767px) {
    width: 100%;
    height: 60vw;
  }
`;

const StyledMap = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledOtherResultsBox = styled.div`
  background-color: #f0f0f0;
  padding: 10px 20px 15px;
  font-size: 0.8rem;
`;
const StyledOtherResultsTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const StyledOtherResultsList = styled.ul`
  padding-left: 15px;
  list-style-type: square;
  color: #555;
`;

const StyledOtherResultsItem = styled.li`
  font-size: 12px;
`;

const StyledRatingBox = styled.div`
  display: flex;
  align-items: center;
`;

const StyledRatingIcon = styled.span`
  margin-right: 7px;
  display: inline-block;
  width: 20px;
  text-align: center;
  color: #3795c0;
`;

const StyledRatingNum = styled.span`
  margin-right: 7px;
`;

const StyledRatingStarList = styled.span`
  margin-top: 2px;
`;

const StyledRatingStarItem = styled.img`
  width: 20px;
  margin-right: 3px;
`;

const Result = ({ result }) => {
  const { keyword, nearestPlace, nearbyPlaces } = result;
  const { name, rating, reviewCount, distance, duration, geocode } = nearestPlace;

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
      <StyleResultItemKeyword>
        <b>最寄りの{keyword}</b>
      </StyleResultItemKeyword>
      <StyledResult>
        <StyledResultItemDataBox>
          {nearestPlace && (
            <div>
              <StyledResultItemTitle>{name}</StyledResultItemTitle>
              <StyledDataList>
                <li>
                  <StyledRatingBox>
                    <StyledRatingIcon>
                      <FontAwesomeIcon icon={faSmile} />
                    </StyledRatingIcon>
                    {rating ? (
                      <>
                        <StyledRatingNum>{rating}</StyledRatingNum>
                        <StyledRatingStarList>
                          {getRatingStars() &&
                            getRatingStars().map((star, i) => (
                              <StyledRatingStarItem
                                key={i}
                                src={star}
                                alt='Rating Star'
                              />
                            ))}
                        </StyledRatingStarList>
                        <span>({reviewCount})</span>
                      </>
                    ) : (
                      'まだ評価がありません'
                    )}
                  </StyledRatingBox>
                </li>
                <li>
                  <StyledRatingIcon>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </StyledRatingIcon>
                  <span>距離 : </span>
                  <span>{getDisplayDistance(distance)}</span>
                </li>
                <li>
                  <StyledRatingIcon>
                    <FontAwesomeIcon icon={faClock} />
                  </StyledRatingIcon>
                  <span>所要時間(徒歩) : </span>
                  <span>{duration}</span>
                </li>
              </StyledDataList>
            </div>
          )}
          {nearbyPlaces.length > 0 && (
            <StyledOtherResultsBox>
              <StyledOtherResultsTitle>検索にヒットした場所</StyledOtherResultsTitle>
              <StyledOtherResultsList>
                {nearbyPlaces.map((place, i) => (
                  <StyledOtherResultsItem key={i}>
                    {place.name} ( {getDisplayDistance(place.distance)} /{' '}
                    {place.duration} )
                  </StyledOtherResultsItem>
                ))}
              </StyledOtherResultsList>
            </StyledOtherResultsBox>
          )}
        </StyledResultItemDataBox>
        <StyledResultItemMap>
          <StyledMap id='map' ref={map}></StyledMap>
        </StyledResultItemMap>
      </StyledResult>
    </>
  );
};

export default Result;
