import { styled } from 'styled-components';

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

type ResultItemOtherPlacesProps = {
  places: {
    name: string;
    address: string;
    distance: number;
    duration: string;
    lat: number;
    lng: number;
  }[];
};

const ResultItemOtherPlaces = ({ places }: ResultItemOtherPlacesProps) => {
  // 距離を表示用にフォーマットする
  const formatDistanceWithUnit = (distance: number) => {
    let distanceWithUnit = '';

    if (distance >= 1000) {
      distanceWithUnit = (distance / 1000).toFixed(1) + 'km';
    } else {
      distanceWithUnit += 'm';
    }

    return distanceWithUnit;
  };

  return (
    <>
      {places.length > 0 && (
        <StyledOtherResultsBox>
          <StyledOtherResultsTitle>検索にヒットした場所</StyledOtherResultsTitle>
          <StyledOtherResultsList>
            {places.map((place, i) => (
              <StyledOtherResultsItem key={i}>
                {place.name} ( {formatDistanceWithUnit(place.distance)} / {place.duration} )
              </StyledOtherResultsItem>
            ))}
          </StyledOtherResultsList>
        </StyledOtherResultsBox>
      )}
    </>
  );
};

export default ResultItemOtherPlaces;
