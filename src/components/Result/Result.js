import { useContext } from 'react';
import ResultContext from '../../context/result/ResultContext';
import ResultHeader from './ResultHeader';
import ResultWithPlace from './ResultWithPlace';
import ResultWithoutPlace from './ResultWithoutPlace';
import ResultBtnBack from './ResultBtnBack';

const Results = () => {
  const { results } = useContext(ResultContext);

  let resultsWithPlace = [];
  let resultsWithoutPlace = [];

  results.forEach((result) => {
    if (result.nearestPlace) {
      resultsWithPlace = [...resultsWithPlace, result];
    } else {
      resultsWithoutPlace = [...resultsWithoutPlace, result];
    }
  });

  return (
    <>
      <ResultHeader />
      <ResultWithoutPlace places={resultsWithoutPlace} />
      <ResultWithPlace places={resultsWithPlace} />
      <ResultBtnBack />
    </>
  );
};

export default Results;
