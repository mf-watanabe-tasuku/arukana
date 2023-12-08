import { useContext } from 'react';
import { styled } from 'styled-components';
import ResultContext from '../../context/result/ResultContext';
import ResultItem from './ResultItem';
import ResultHeader from './ResultHeader';

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
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.1em;
  background-color: #ccc;
  box-shadow: 0 6px 0 #777;
  border: none;
  border-radius: 5px;
  margin: 50px auto 0;
  display: block;
  cursor: pointer;
  transition-duration: 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

const Results = () => {
  const { results, clearResults } = useContext(ResultContext);

  let resultsWithNearestPlaces = [];
  let resultsWithoutNearestPlaces = [];

  results.forEach((result) => {
    if (result.nearestPlace) {
      resultsWithNearestPlaces = [...resultsWithNearestPlaces, result];
    } else {
      resultsWithoutNearestPlaces = [...resultsWithoutNearestPlaces, result];
    }
  });

  return (
    <>
      <ResultHeader />
      {resultsWithoutNearestPlaces.length > 0 && (
        <StyledNoResults>
          <StyledResultList>
            {resultsWithoutNearestPlaces.map((result, i) => (
              <li key={i}>{result.keyword}は見つかりませんでした</li>
            ))}
          </StyledResultList>
        </StyledNoResults>
      )}
      <ul>
        {resultsWithNearestPlaces.map((result, i) => {
          return result.nearestPlace && <ResultItem key={i} result={result} />;
        })}
      </ul>
      <StyledBtnBack onClick={clearResults}>
        トップへ戻る
      </StyledBtnBack>
    </>
  );
};

export default Results;
