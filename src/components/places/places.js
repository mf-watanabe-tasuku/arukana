import React, { useContext } from "react";
import PlaceItem from "./PlaceItem";
import "../../styles/Places.css";
import PlaceContext from "../../context/place/placeContext";

const Places = ({ originGeocode, places }) => {
  const placeContext = useContext(PlaceContext);

  // let noResults = [];
  // let withResults = [];

  // places.forEach((place) => {
  //   if (place.nearestPlace) {
  //     withResults = [...withResults, place];
  //   } else {
  //     noResults = [...noResults, place];
  //   }
  // });

  // return (
  //   <>
  //     {noResults.length > 0 && (
  //       <div className="no-results">
  //         <ul className="no-results__list">
  //           {noResults.map((result, i) => (
  //             <li key={i}>{result.keyword}は見つかりませんでした</li>
  //           ))}
  //         </ul>
  //       </div>
  //     )}
  //     <ul className="result-list">
  //       {withResults.map((result, i) => {
  //         return (
  //           result.nearestPlace && (
  //             <PlaceItem
  //               key={i}
  //               originGeocode={originGeocode}
  //               result={result}
  //             />
  //           )
  //         );
  //       })}
  //     </ul>
  //   </>
  // );
  return <div>test</div>;
};

export default Places;
