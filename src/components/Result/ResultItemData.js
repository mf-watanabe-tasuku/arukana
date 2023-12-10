import { styled } from 'styled-components';
import ResultItemOtherPlaces from './ResultItemOtherPlaces';
import ResultItemRating from './ResultItemRating';
import ResultItemDistance from './ResultItemDistance';
import ResultItemDuration from './ResultItemDuration';

const StyledResultItemData = styled.div`
  width: 51%;
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

const ResultItemData = ({ nearestPlace, nearbyPlaces }) => {
  const { name } = nearestPlace;

  return (
    <StyledResultItemData>
      <StyledResultItemTitle>{name}</StyledResultItemTitle>
      <StyledMetaList>
        <ResultItemRating nearestPlace={nearestPlace} />
        <ResultItemDistance nearestPlace={nearestPlace} />
        <ResultItemDuration nearestPlace={nearestPlace} />
      </StyledMetaList>
      <ResultItemOtherPlaces places={nearbyPlaces} />
    </StyledResultItemData>
  );
};

export default ResultItemData;
