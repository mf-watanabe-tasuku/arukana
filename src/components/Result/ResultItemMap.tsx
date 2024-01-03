import { useEffect, useRef, useContext } from 'react';
import { styled } from 'styled-components';
import SearchContext from '../../context/search/SearchContext';

const StyledResultItemMap = styled.div`
  @media (max-width: 767px) {
    height: 50vw;
  }
`;

const StyledMap = styled.div`
  width: 100%;
  height: 100%;
`;

type ResultItemMapProps = {
  nearestPlace: {
    geocode: {
      lat: number;
      lng: number;
    };
  };
};

const ResultItemMap = ({ nearestPlace }: ResultItemMapProps) => {
  const { geocode } = nearestPlace;

  const { originGeocode } = useContext(SearchContext);

  const map = useRef(null);

  useEffect(() => {
    const drawMap = () => {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      const displayMap = new window.google.maps.Map(map.current!, {
        zoom: 13,
        center: { lat: originGeocode.lat, lng: originGeocode.lng },
        disableDefaultUI: true,
      });
      directionsRenderer.setMap(displayMap);

      calculateAndDisplayRoute(directionsService, directionsRenderer);
    };

    const calculateAndDisplayRoute = (
      directionsService: google.maps.DirectionsService,
      directionsRenderer: google.maps.DirectionsRenderer
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
        (response, status: string) => {
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
    <StyledResultItemMap>
      <StyledMap id='map' ref={map}></StyledMap>
    </StyledResultItemMap>
  );
};

export default ResultItemMap;
