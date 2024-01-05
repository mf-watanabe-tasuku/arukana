import { styled } from 'styled-components';
import type { ResultItemProps } from '../../types';
import ResultItemOtherPlaces from './ResultItemOtherPlaces';
import ResultItemRating from './ResultItemRating';
import ResultItemDistance from './ResultItemDistance';
import ResultItemDuration from './ResultItemDuration';

const StyledResultItemData = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 22px;
`;

const StyledResultItemTitle = styled.p`
  margin-top: 2px;
  font-size: 20px;
  line-height: 1.4;
`;

const StyledMetaList = styled.ul`
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
