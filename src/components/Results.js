import Result from './Result';
import '../styles/Results.css';

const Results = ({ results, originGeocode }) => {
  let noResults = [];
  let withResults = [];

  results.forEach((result) => {
    if (result.nearestPlace) {
      withResults = [...withResults, result];
    } else {
      noResults = [...noResults, result];
    }
  });

  return (
    <>
      {noResults.length > 0 && (
        <div className='no-results'>
          <ul className='no-results__list'>
            {noResults.map((result, i) => (
              <li key={i}>{result.keyword}は見つかりませんでした</li>
            ))}
          </ul>
        </div>
      )}
      <ul className='result-list'>
        {withResults.map((result, i) => {
          return (
            result.nearestPlace && (
              <Result key={i} originGeocode={originGeocode} result={result} />
            )
          );
        })}
      </ul>
    </>
  );
};

export default Results;
