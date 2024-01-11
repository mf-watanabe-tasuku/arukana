import { useContext } from 'react';
import { styled } from 'styled-components';
import { useResultsDispatch } from '../../context/ResultsContext';
import SearchContext from '../../context/search/SearchContext';

const StyledSearchResultsOriginText = styled.p`
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const StyledSearchResultsBackBox = styled.div`
  margin-bottom: 40px;
`;

const StyledSearchResultsBackLink = styled.p`
  cursor: pointer;
  color: #0077c3;
  display: inline-block;
  text-decoration: underline;
`;

const ResultHeader: React.FC = () => {
  const resultsDispatch = useResultsDispatch();
  const { originAddress, radius } = useContext(SearchContext);

  return (
    <>
      <StyledSearchResultsOriginText>
        「{originAddress}」から半径{radius}m以内の検索結果
      </StyledSearchResultsOriginText>
      <StyledSearchResultsBackBox>
        <StyledSearchResultsBackLink onClick={() => resultsDispatch([])}>
          トップへ戻る
        </StyledSearchResultsBackLink>
      </StyledSearchResultsBackBox>
    </>
  );
};

export default ResultHeader;
