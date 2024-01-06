import { useContext } from 'react';
import ResultContext from '../../context/result/ResultContext';
import ResultItem from './ResultItem';

const ResultWithPlace: React.FC = () => {
  const { results } = useContext(ResultContext);

  const resultsWithPlace = results.filter(result => result.nearestPlace);

  return (
    <>
      {resultsWithPlace.length > 0 && (
        <ul>
          {resultsWithPlace.map((result, i) => {
            return result.nearestPlace && <ResultItem key={i} result={result} />;
          })}
        </ul>
      )}
    </>
  );
};

export default ResultWithPlace;
