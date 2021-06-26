import ResultItem from "./resultItem";
import "../styles/ResultList.css";

const resultList = ({ originGeocode, places }) => {
  let noResults = [];
  let withResults = [];

  places.forEach((place) => {
    if (place.nearestPlace) {
      withResults = [...withResults, place];
    } else {
      noResults = [...noResults, place];
    }
  });

  return (
    <div className="result-list">
      <ul>
        {noResults.map((result, i) => (
          <li key={i}>{result.keyword}は見つかりませんでした</li>
        ))}
      </ul>
      <ul className="result-list">
        {withResults.map((result, i) => {
          return (
            result.nearestPlace && (
              <ResultItem
                key={i}
                originGeocode={originGeocode}
                result={result}
              />
            )
          );
        })}
      </ul>
    </div>
  );
};

export default resultList;
