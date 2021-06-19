import ResultItem from "./resultItem";
import "../styles/ResultList.css";

const resultList = ({ places }) => {
  return (
    <ul className="result-list">
      {places.map((result, index) => (
        <ResultItem key={index} result={result} />
      ))}
    </ul>
  );
};

export default resultList;
