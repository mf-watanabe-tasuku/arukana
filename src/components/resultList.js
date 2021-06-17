import ResultItem from "./resultItem";

const resultList = ({ results }) => {
  return (
    <ul>
      {results[0] &&
        results.map((result, index) => (
          <ResultItem key={index} result={result} />
        ))}
    </ul>
  );
};

export default resultList;
