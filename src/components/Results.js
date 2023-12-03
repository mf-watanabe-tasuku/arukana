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
      <p className='search-results__origin-text'>
        「{originAddress}」から半径{radius}m以内の検索結果
      </p>
      <div className='search-results__back-box'>
        <p className='search-results__back-link' onClick={clearResults}>
          トップへ戻る
        </p>
      </div>
      {placeNotExistingResults.length > 0 && (
        <StyledNoResults>
          <StyledResultList>
            {placeNotExistingResults.map((result, i) => (
              <li key={i}>{result.keyword}は見つかりませんでした</li>
            ))}
          </StyledResultList>
        </StyledNoResults>
      )}
      <ul className='result-list'>
        {placeExistingResults.map((result, i) => {
          return result.nearestPlace && <Result key={i} result={result} />;
        })}
      </ul>
      <button className='btn-back' onClick={clearResults}>
        トップへ戻る
      </button>
    </>
  );
};

export default Results;
