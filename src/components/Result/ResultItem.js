import { styled } from 'styled-components';
import ResultItemData from './ResultItemData';
import ResultItemMap from './ResultItemMap';

const StyledResultItem = styled.li`
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

const ResultItem = ({ result }) => {
  const { keyword, nearestPlace, nearbyPlaces } = result;

  return (
    <>
      <StyleResultItemKeyword>最寄りの{keyword}</StyleResultItemKeyword>
      <StyledResultItem>
        <ResultItemData nearestPlace={nearestPlace} nearbyPlaces={nearbyPlaces} />
        <ResultItemMap nearestPlace={nearestPlace} />
      </StyledResultItem>
    </>
  );
};

export default ResultItem;
