import { useResults } from '../../context/ResultsContext';
import ResultItem from './ResultItem';

const ResultWithPlace: React.FC = () => {
  const { results } = useResults();

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
