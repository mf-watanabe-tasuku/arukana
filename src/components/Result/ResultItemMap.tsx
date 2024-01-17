import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import type { ResultItemProps } from '../../types';
import { useForm } from '../../context/FormContext';

const StyledResultItemMap = styled.div`
  @media (max-width: 767px) {
    height: 50vw;
  }
`;

const StyledMap = styled.div`
  width: 100%;
  height: 100%;
`;

const ResultItemMap: React.FC<ResultItemProps> = ({ result }) => {
  const { nearestPlace } = result;
  const { geocode } = nearestPlace;

  const { originGeocode } = useForm();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Google MapをDOMに描画する処理
    const displayMap = new window.google.maps.Map(ref.current!, {
      zoom: 13,
      center: { lat: originGeocode.lat, lng: originGeocode.lng },
      disableDefaultUI: true,
    });
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(displayMap);

    // Google Mapにルートを描画する処理
    const directionsService = new window.google.maps.DirectionsService();
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
  }, [originGeocode, geocode]);

  return (
    <StyledResultItemMap>
      <StyledMap id='map' ref={ref}></StyledMap>
    </StyledResultItemMap>
  );
};

export default ResultItemMap;
