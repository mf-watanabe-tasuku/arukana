import { useContext } from 'react';
import Result from './Result';
import ResultContext from '../context/result/ResultContext';
import '../styles/Results.css';

const Results = () => {
  const { results }= useContext(ResultContext);

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
      {placeNotExistingResults.length > 0 && (
        <div className='no-results'>
          <ul className='no-results__list'>
            {placeNotExistingResults.map((result, i) => (
              <li key={i}>{result.keyword}は見つかりませんでした</li>
            ))}
          </ul>
        </div>
      )}
      <ul className='result-list'>
        {placeExistingResults.map((result, i) => {
          return (
            result.nearestPlace && (
              <Result key={i} result={result} />
            )
          );
        })}
      </ul>
    </>
  );
};

export default Results;
