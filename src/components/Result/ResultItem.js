import { useEffect, useRef, useContext } from 'react';
import { styled } from 'styled-components';
import SearchContext from '../../context/search/SearchContext';
import ResultItemData from './ResultItemData';

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
  font-weight: bold;
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

const ResultItem = ({ result }) => {
  const { keyword, nearestPlace, nearbyPlaces } = result;
  const { geocode } = nearestPlace;

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

  return (
    <>
      <StyleResultItemKeyword>最寄りの{keyword}</StyleResultItemKeyword>
      <StyledResult>
        <ResultItemData nearestPlace={nearestPlace} nearbyPlaces={nearbyPlaces} />
        <StyledResultItemMap>
          <StyledMap id='map' ref={map}></StyledMap>
        </StyledResultItemMap>
      </StyledResult>
    </>
  );
};

export default ResultItem;
