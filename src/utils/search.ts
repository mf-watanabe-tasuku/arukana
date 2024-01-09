import {
  Radius,
  OriginGeocode,
  GetOriginGeocode,
  FormattedNearbyPlaces,
  FormattedNearbyPlace,
  GetSearchResults,
  FormatDistanceWithUnit,
  HasErrorMessages
} from "../types";

/**
 * 基準地点の座標を取得する関数
 * @param {string} address - 基準地点の住所
 * @return {Geocode}
 */
const getOriginGeocode: GetOriginGeocode = async (address) => {
  const geocoder = new window.google.maps.Geocoder();
  const originGeocode = await geocoder.geocode(
    { address },
    (results, status) => (status === 'OK' ? results : status)
  );

  const formattedOriginGeocode = {
    lat: originGeocode.results[0].geometry.location.lat(),
    lng: originGeocode.results[0].geometry.location.lng(),
  };

  return formattedOriginGeocode;
};

/**
 * 周辺施設の検索結果を取得する関数
 * @param {function} fn - 検索結果をAPIで取得する関数
 * @param {string} address - 基準地点の住所
 * @param {string[]} keywords - 検索キーワード
 * @param {Radius} radius - 検索範囲距離
 * @return {Promise}
 */
const getSearchResults: GetSearchResults = async (fn, address, keywords, radius) => {
  const originGeocode = await getOriginGeocode(address);
  fn(originGeocode);
  return await Promise.all(
    keywords.map(keyword => {
      return new Promise(resolve => {
        setTimeout(() => {
          const nearbyPlaces = fetchNearbyPlaces(address, originGeocode, keyword, radius);
          resolve(nearbyPlaces);
        }, 1000);
      });
    })
  );
}

/**
 * APIで周辺の施設を検索する関数
 * @param {string} address - 基準地点の住所
 * @param {geocode} geocode - 基準地点の座標
 * @param {string} keyword - 検索対象の施設のキーワード
 * @param {string} radius - 検索範囲距離
 */
const fetchNearbyPlaces = (address: string, geocode: OriginGeocode, keyword: string, radius: Radius) => {
  const div = document.createElement('div');
  const service = new window.google.maps.places.PlacesService(div);
  const searchConditions = {
    location: new window.google.maps.LatLng(geocode.lat, geocode.lng),
    radius: Number(radius),
    keyword
  };

  return new Promise(resolve => {
    service.nearbySearch(searchConditions, async nearbyPlaces => {
      const formattedNearbyPlaces: FormattedNearbyPlaces | undefined = nearbyPlaces?.map(nearbyPlace => {
        return {
          name: nearbyPlace.name,
          rating: nearbyPlace.rating,
          ratings_total: nearbyPlace.user_ratings_total,
          lat: nearbyPlace?.geometry?.location?.lat(),
          lng: nearbyPlace?.geometry?.location?.lng()
        };
      });

      const placeDistanceData = await getPlaceDistanceData(address, formattedNearbyPlaces, radius);
      const keywordWithResults = {
        keyword,
        ...placeDistanceData
      };

      resolve(keywordWithResults);
    });
  });
};

/**
 * 基準地点からの距離と所要時間を取得する関数
 * @param {string} address - 基準地点の住所
 * @param {FormattedNearbyPlaces | undefined} places - 検索結果の施設
 * @param {string} radius - 検索範囲距離
 * @return {Object}
 */
const getPlaceDistanceData = async (address: any, places: FormattedNearbyPlaces | undefined, radius: any) => {
  if (!places) return;

  const placesWithDistance = await Promise.all(
    places.map(async place => {
      const distanceData = await fetchDistanceData(address, place);

      const placeWithDistanceObj = {
        name: place.name,
        rating: place.rating,
        reviewCount: place.ratings_total,
        geocode: { lat: place.lat, lng: place.lng },
        ...distanceData
      };
      return placeWithDistanceObj;
    })
  );

  const filteredResults = placesWithDistance.filter(place => {
    return place.distance && place.distance <= Number(radius);
  });

  const sortedResults = filteredResults.sort((place_a, place_b) => {
    if (place_a.distance === undefined || place_b.distance === undefined) return 0;

    return place_a.distance - place_b.distance;
  });

  const [nearestPlace, ...nearbyPlaces] = sortedResults.slice(0, 4);

  const placeDistanceData = { nearestPlace, nearbyPlaces };

  return placeDistanceData;
};

// 距離と所要時間を取得してオブジェクトで返す
const fetchDistanceData = (address: any, place: FormattedNearbyPlace): Promise<{ distance: number | undefined; duration: string | undefined; }> => {
  const service = new window.google.maps.DistanceMatrixService();
  const distanceMatrixConditions = {
    origins: [address],
    destinations: [place.name] as string[],
    travelMode: window.google.maps.TravelMode.WALKING
  };

  return new Promise(resolve => {
    service.getDistanceMatrix(distanceMatrixConditions, res => {
      if (!res) return;

      const data = res.rows[0].elements[0];
      const distanceDataObj: {
        distance: number | undefined;
        duration: string | undefined;
      } = {
        distance: undefined,
        duration: undefined
      };
      if (data.status === 'OK') {
        distanceDataObj.distance = data.distance.value;
        distanceDataObj.duration = data.duration.text;
      }

      resolve(distanceDataObj);
    });
  });
};

/**
 * 距離を表示用にフォーマットする関数
 * @param {number} distance - 距離
 * @return {string} distanceWithUnit - 距離と単位を結合した文字列
 */
const formatDistanceWithUnit: FormatDistanceWithUnit = distance => {
  if (!distance) return;

  let distanceWithUnit = String(distance);

  if (distance >= 1000) {
    distanceWithUnit = (distance / 1000).toFixed(1) + 'km';
  } else {
    distanceWithUnit += 'm';
  }

  return distanceWithUnit;
};


/**
 * エラーメッセージがあるかどうかを判定する関数
 * @param {object} messages - エラーメッセージ
 * @return {boolean} hasError - エラーメッセージがあるかどうか
 */
const hasErrorMessages: HasErrorMessages = messages => {
  let hasError = false;

  const errorMessagesInArray = Object.entries(messages);
  errorMessagesInArray.map(([, value]) => {
    if (value) hasError = true;
  });

  return hasError;
}


export { getSearchResults, formatDistanceWithUnit, hasErrorMessages };
