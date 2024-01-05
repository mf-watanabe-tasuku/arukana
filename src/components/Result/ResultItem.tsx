import { styled } from 'styled-components';
import { ResultItemProps } from '../../types';
import ResultItemData from './ResultItemData';
import ResultItemMap from './ResultItemMap';

const StyledResultItem = styled.li`
  background-color: #fff;
  min-height: 250px;
  margin-bottom: 30px;
  border-bottom: 1px solid #999;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  box-shadow: 0 1px 5px #c0c0c0;
  padding: 25px 30px;

  @media (max-width: 767px) {
    padding: 20px;
    grid-template-columns: 1fr;
  }
`;

const StyleResultItemKeyword = styled.p`
  margin-bottom: 5px;
  font-weight: bold;
`;

const ResultItem: React.FC<ResultItemProps> = ({ result }) => {
  const { keyword, nearestPlace } = result;

  return (
    <>
      <StyleResultItemKeyword>最寄りの{keyword}</StyleResultItemKeyword>
      <StyledResultItem>
        <ResultItemData result={result} />
        <ResultItemMap result={result} />
      </StyledResultItem>
    </>
  );
};

export default ResultItem;
