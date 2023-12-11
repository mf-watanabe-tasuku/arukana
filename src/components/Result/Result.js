import ResultHeader from './ResultHeader';
import ResultWithPlace from './ResultWithPlace';
import ResultWithoutPlace from './ResultWithoutPlace';
import ResultBtnBack from './ResultBtnBack';

const Results = () => {
  return (
    <>
      <ResultHeader />
      <ResultWithoutPlace />
      <ResultWithPlace />
      <ResultBtnBack />
    </>
  );
};

export default Results;
