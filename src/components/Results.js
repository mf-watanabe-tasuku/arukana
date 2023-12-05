import { useContext } from 'react';
import { styled } from 'styled-components';
import ResultContext from '../context/result/ResultContext';
import SearchContext from '../context/search/SearchContext';
import Result from './Result';

const StyledNoResults = styled.div`
  margin-bottom: 40px;
  border: 2px solid tomato;
  border-radius: 5px;
  background-color: rgb(255, 194, 194);
  padding: 30px 30px 30px 50px;
`;

const StyledResultList = styled.ul`
  list-style-type: none;
  margin: 0 auto;
`;

const StyledBtnBack = styled.button`
  width: 300px;
  padding: 12px 0;
  text-align: center;
  color: #555;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.1em;
  background-color: #ccc;
  box-shadow: 0 6px 0 #777;
  border: none;
  border-radius: 5px;
  margin: 0 auto;
  display: block;
  cursor: pointer;
  transition-duration: 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

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

const Results = () => {
  const { results, clearResults } = useContext(ResultContext);
  const { originAddress, radius } = useContext(SearchContext);

  let placeNotExistingResults = [];
  let placeExistingResults = [];

  results.forEach((result) => {
    if (result.nearestPlace) {
      placeExistingResults = [...placeExistingResults, result];
    } else {
      placeNotExistingResults = [...placeNotExistingResults, result];
    }
  });

  return (
    <>
      <StyledSearchResultsOriginText>
        「{originAddress}」から半径{radius}m以内の検索結果
      </StyledSearchResultsOriginText>
      <StyledSearchResultsBackBox>
        <StyledSearchResultsBackLink onClick={clearResults}>
          トップへ戻る
        </StyledSearchResultsBackLink>
      </StyledSearchResultsBackBox>
      {placeNotExistingResults.length > 0 && (
        <StyledNoResults>
          <StyledResultList>
            {placeNotExistingResults.map((result, i) => (
              <li key={i}>{result.keyword}は見つかりませんでした</li>
            ))}
          </StyledResultList>
        </StyledNoResults>
      )}
      <ul>
        {placeExistingResults.map((result, i) => {
          return result.nearestPlace && <Result key={i} result={result} />;
        })}
      </ul>
      <StyledBtnBack onClick={clearResults}>
        トップへ戻る
      </StyledBtnBack>
    </>
  );
};

export default Results;
