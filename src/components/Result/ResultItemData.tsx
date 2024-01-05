import { styled } from 'styled-components';
import type { ResultProps } from './ResultItem';
import ResultItemOtherPlaces from './ResultItemOtherPlaces';
import ResultItemRating from './ResultItemRating';
import ResultItemDistance from './ResultItemDistance';
import ResultItemDuration from './ResultItemDuration';

const StyledResultItemData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledResultItemTitle = styled.p`
  margin-bottom: 15px;
  font-size: 20px;
`;

const StyledMetaList = styled.ul`
  margin-bottom: 22px;
  list-style: none;
`;

const ResultItemData: React.FC<ResultProps> = ({ nearestPlace, nearbyPlaces }) => {
  return (
    <StyledResultItemData>
      <StyledResultItemTitle>{nearestPlace.name}</StyledResultItemTitle>
      <StyledMetaList>
        <ResultItemRating nearestPlace={nearestPlace} />
        <ResultItemDistance nearestPlace={nearestPlace} />
        <ResultItemDuration nearestPlace={nearestPlace} />
      </StyledMetaList>
      <ResultItemOtherPlaces nearestPlace={nearestPlace} nearbyPlaces={nearbyPlaces} />
    </StyledResultItemData>
  );
};

export default ResultItemData;
