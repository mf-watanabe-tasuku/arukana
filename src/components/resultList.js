import ResultItem from "./resultItem";

const resultList = (props) => {
  return (
    <ul>
      {props.results[0] &&
        props.results.map((result, index) => (
          <ResultItem key={index} result={result} />
        ))}
    </ul>
  );
};

export default resultList;
