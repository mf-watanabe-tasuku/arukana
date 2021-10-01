import React, { useEffect, useReducer } from "react";
import PlaceContext from "./placeContext";
import PlaceReducer from "./placeReducer";
import { SEARCH_PLACES, CLEAR_PLACES, SET_LOADING } from "../types";

let searchResults = [];

const PlaceState = (props) => {
  const initialState = {
    loading: false,
    places: {},
  };

  const [state, dispatch] = useReducer(PlaceReducer, initialState);

  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    googleMapScript.async = true;
    document.body.appendChild(googleMapScript);
  }, []);

  // 基準地点の座標を取得する
  const getOriginGeocode = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const geocode = await geocoder.geocode(
      { address: "東京都世田谷区経堂5-15-18" },
      (results, status) => (status === "OK" ? results : status)
    );

    return {
      lat: geocode.results[0].geometry.location.lat(),
      lng: geocode.results[0].geometry.location.lng(),
    };
  };

  // 周辺の施設を検索する
  const getNearbyPlaces = async (geocode, keyword, radius) => {
    return new Promise((resolve) => {
      const searchConditions = {
        location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
        radius,
        keyword,
      };

      const div = document.createElement("div");
      const service = new window.google.maps.places.PlacesService(div);

      service.nearbySearch(searchConditions, async (results, status) => {
        const formattedPlaces = results.map((result) => {
          return {
            name: result.name,
            rating: result.rating,
            ratings_total: result.user_ratings_total,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          };
        });

        let placeArr = [];

        await Promise.all(
          formattedPlaces.map(async (place) => {
            let placeData = await getDistanceData(place);
            if (placeData.distance <= radius) {
              placeData = {
                ...placeData,
                geocode: { lat: place.lat, lng: place.lng },
              };
              placeArr = [...placeArr, placeData];
            }
          })
        );

        const arr = placeArr.sort((a, b) => a.distance - b.distance);
        const slicedArr = arr.slice(0, 4);

        const [nearestPlace, ...otherPlaces] = slicedArr;
        const placeResults = { keyword, nearestPlace, otherPlaces };

        searchResults = [...searchResults, placeResults];
        dispatch({
          type: SEARCH_PLACES,
          payload: searchResults,
        });
        resolve();
      });
    });
  };

  // 距離と所要時間を取得してオブジェクトで返す
  const getDistanceData = async (destination) => {
    const service = new window.google.maps.DistanceMatrixService();
    return service
      .getDistanceMatrix({
        origins: ["東京都世田谷区経堂5-15-18"],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.WALKING,
      })
      .then((res) => {
        const data = res.rows[0].elements;
        return {
          name: destination.name,
          rating: destination.rating,
          ratings_total: destination.ratings_total,
          distance: data[0].distance.value,
          duration: data[0].duration.text,
        };
      })
      .catch((err) => {
        console.log("Error: " + err.message);
      });
  };

  const clearPlaces = () => dispatch({ type: CLEAR_PLACES });

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <PlaceContext.Provider
      value={{
        loading: state.loading,
        places: state.places,
        getOriginGeocode,
        getNearbyPlaces,
        getDistanceData,
        clearPlaces,
        setLoading,
      }}
    >
      {props.children}
    </PlaceContext.Provider>
  );
};

export default PlaceState;
