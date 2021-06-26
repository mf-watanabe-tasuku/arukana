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
    <>
      <div className="no-results">
        <ul className="no-results__list">
          {noResults.map((result, i) => (
            <li key={i}>{result.keyword}は見つかりませんでした</li>
          ))}
        </ul>
      </div>
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
    </>
  );
};

export default resultList;
