export type NearestPlace = {
  name: string,
  address: string,
  distance: number,
  duration: string,
  lat: number,
  lng: number,
  geocode: {
    lat: number,
    lng: number
  },
  rating: number,
  reviewCount: number
}

export type NearbyPlace = {
  name: string,
  address: string,
  distance: number,
  duration: string,
  lat: number,
  lng: number
}

export type ResultProps = {
  keyword: string,
  nearestPlace: NearestPlace,
  nearbyPlaces: NearbyPlace[]
}

export type ResultItemProps = {
  result: ResultProps
}
