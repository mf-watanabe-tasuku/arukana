import ResultItem from "./resultItem";
import "../styles/ResultList.css";

const resultList = ({ originGeocode, places }) => {
  return (
    <ul className="result-list">
      {places.map((result, index) => (
        <ResultItem key={index} originGeocode={originGeocode} result={result} />
      ))}
    </ul>
  );
};

export default resultList;
