// Node

export type ChildrenNodeProps = {
  children: React.ReactNode
}

// Context・Reducer

export type ResultContextProps = {
  results: ResultsProps,
  setResults: SetResults
}

export type ResultReducerType = (state: State, action: Action) => State;

export type State =
  | {
      results: ResultsProps
    };

export type Action =
  | {
      type: ACTIONS.SET_RESULTS,
      payload: ResultsProps
    };

export type SetResults = (results: ResultsProps) => void;

export type SetLoading = (loading: boolean) => void;

// Result

type NearestPlace = {
  name: string,
  address: string,
  distance: number,
  duration: string,
  rating: number,
  reviewCount: number,
  geocode: {
    lat: number,
    lng: number
  }
}

type NearbyPlace = {
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

export type ResultsProps = ResultProps[] | [];

export type ResultItemProps = {
  result: ResultProps
}
