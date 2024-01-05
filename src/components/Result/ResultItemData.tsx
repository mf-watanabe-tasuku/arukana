import { styled } from 'styled-components';
import type { ResultItemProps } from './ResultItem';
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

const ResultItemData: React.FC<ResultItemProps> = ({ result }) => {
  const { nearestPlace } = result;

  return (
    <StyledResultItemData>
      <StyledResultItemTitle>{nearestPlace.name}</StyledResultItemTitle>
      <StyledMetaList>
        <ResultItemRating result={result} />
        <ResultItemDistance result={result} />
        <ResultItemDuration result={result} />
      </StyledMetaList>
      <ResultItemOtherPlaces result={result} />
    </StyledResultItemData>
  );
};

export default ResultItemData;
