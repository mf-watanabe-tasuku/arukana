// Node

export type ChildrenNodeProps = {
  children: React.ReactNode;
}

// Context・Reducer

export type ResultContextProps = {
  results: ResultsProps;
  setResults: SetResults;
}

export type SearchContextProps = {
  originAddress: string;
  originGeocode: {
    lat: number;
    lng: number;
  };
  freeKeyword: string;
  freeKeywords: string[];
  radius: number;
  recommendChecks: {
    [key: string]: boolean;
  };
  errorMessages: {
    [key: string]: string;
  };
  setOriginAddress: SetOriginAddress;
  setFreeKeyword: SetFreeKeyword;
  addFreeKeywords: KeyboardEventType;
  handleCheckboxChange: ChangeEventType;
  removeFreeKeyword: RemoveFreeKeyword;
  validateSearchValues: ValidateSearchValues;
  handleInputRadius: ChangeEventType;
  getSearchResults: GetSearchResults;
  formatDistanceWithUnit: FormatDistanceWithUnit;
}

export type ResultReducerType = (state: ResultState, action: Action) => State;

export type ResultState =
  | {
      results: ResultsProps;
    };

export type Action =
  | {
      type: ACTIONS.SET_RESULTS;
      payload: ResultsProps
    };

// State
export type SetOriginAddress = (originAddress: string) => void;

export type SetFreeKeyword = (freeKeyword: string) => void;

export type KeyboardEventType = (e: React.KeyboardEvent<HTMLInputElement>) => void;

export type ChangeEventType = React.ChangeEventHandler<HTMLInputElement>;

export type RemoveFreeKeyword = (index: string) => void;

export type ValidateSearchValues = () => {};

export type HandleInputRadius = React.ChangeEventHandler<HTMLInputElement>;

export type GetSearchResults = () => Promise;

export type FormatDistanceWithUnit = (distance: number) => string;

export type SetResults = (results: ResultsProps) => void;

export type SetLoading = (loading: boolean) => void;

// Result

type NearestPlace = {
  name: string;
  address: string;
  distance: number;
  duration: string;
  rating: number;
  reviewCount: number;
  geocode: {
    lat: number;
    lng: number;
  };
};

type NearbyPlace = {
  name: string;
  address: string;
  distance: number;
  duration: string;
  lat: number;
  lng: number;
};

export type ResultProps = {
  keyword: string;
  nearestPlace: NearestPlace;
  nearbyPlaces: NearbyPlace[];
};

export type ResultsProps = ResultProps[] | [];

export type ResultItemProps = {
  result: ResultProps;
};
