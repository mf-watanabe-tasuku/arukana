import { useContext } from 'react';
import ResultContext from '../../context/result/ResultContext';
import ResultItem from './ResultItem';

type ResultWithPlaceProps = {
  keyword: string;
  nearestPlace: {
    name: string;
    address: string;
    distance: number;
    duration: string;
    lat: number;
    lng: number;
    geocode: {
      lat: number;
      lng: number;
    };
    rating: number;
    reviewCount: number;
  };
  nearbyPlaces: {
    name: string;
    address: string;
    distance: number;
    duration: string;
    lat: number;
    lng: number;
  }[];
};

const ResultWithPlace = () => {
  const { resultsWithPlace } = useContext(ResultContext);

  return (
    <>
      {resultsWithPlace.length > 0 && (
        <ul>
          {resultsWithPlace.map((result: ResultWithPlaceProps, i: number) => {
            return result.nearestPlace && <ResultItem key={i} result={result} />;
          })}
        </ul>
      )}
    </>
  );
};

export default ResultWithPlace;
