import ResultItem from './ResultItem';

const ResultWithPlace = ({ places }) => {
  return (
    <>
      {places && (
        <ul>
          {places.map((place, i) => {
            return place.nearestPlace && <ResultItem key={i} result={place} />;
          })}
        </ul>
      )}
    </>
  );
};

export default ResultWithPlace;
