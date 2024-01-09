import { styled } from 'styled-components';
import type { ResultItemProps } from '../../types';
import { formatDistanceWithUnit } from '../../utils/search';

const StyledOtherResultsBox = styled.div`
  background-color: #f0f0f0;
  padding: 13px 20px 15px;
`;
const StyledOtherResultsTitle = styled.div`
  font-weight: bold;
  margin-bottom: 7px;
`;

const StyledOtherResultsList = styled.ul`
  padding-left: 15px;
  list-style-type: square;
  color: #555;
`;

const StyledOtherResultsItem = styled.li`
  font-size: 14px;
`;

const ResultItemOtherPlaces: React.FC<ResultItemProps> = ({ result }) => {
  const { nearbyPlaces } = result;

  return (
    <StyledOtherResultsBox>
      <StyledOtherResultsTitle>検索にヒットした場所</StyledOtherResultsTitle>
      {nearbyPlaces.length > 0 ? (
        <StyledOtherResultsList>
          {nearbyPlaces.map((place, i) => (
            <StyledOtherResultsItem key={i}>
              {place.name} ( {formatDistanceWithUnit(place.distance)} / {place.duration} )
            </StyledOtherResultsItem>
          ))}
        </StyledOtherResultsList>
      ) : (
        <p>指定した距離圏内には、他にマッチする場所は見つかりませんでした。</p>
      )}
    </StyledOtherResultsBox>
  );
};

export default ResultItemOtherPlaces;
