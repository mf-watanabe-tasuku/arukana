// Node

export type ChildrenNodeProps = {
  children: React.ReactNode;
};

// Context・Reducer

export type ResultsContextType = {
  results: ResultsState;
  setResults: React.Dispatch<ResultsState>;
}

export type LoadingContextType = {
  loading: LoadingState;
  setLoading: React.Dispatch<LoadingState>;
}

export type OriginGeocode = {
  lat: number;
  lng: number;
}

export type Radius = string | number;

export type ErrorMessage = {
  [key: string]: string;
};

export type FormContextProps = {
  originAddress: string;
  originGeocode: OriginGeocode;
  freeKeyword: string;
  freeKeywords: string[];
  targetKeywords: string[];
  radius: Radius;
  recommendChecks: {
    [key: string]: boolean;
  };
  errorMessages: ErrorMessage;
  setOriginAddress: SetOriginAddress;
  setOriginGeocode: SetOriginGeocode;
  setFreeKeyword: SetFreeKeyword;
  setFreeKeywords: SetFreeKeywords;
  setRadius: SetRadius;
  setErrorMessages: SetErrorMessages;
  setRecommendChecks: any;
  setTargetKeywords: any;
};

export type ResultProps = {
  keyword: string;
  nearestPlace: NearestPlace;
  nearbyPlaces: NearbyPlace[] | [];
};

export type ResultsState = ResultProps[] | [];

export type FormReducerType = (state: FormState, action: FormAction) => FormState;

export type FormState = {
  originAddress: string;
  originGeocode: {
    lat: number;
    lng: number;
  };
  freeKeyword: string;
  freeKeywords: string[];
  targetKeywords: string[];
  radius: Radius;
  recommendChecks: {
    [key: string]: boolean;
  };
  errorMessages: ErrorMessage;
};

export type ErrorMessageType = {
  message: string
};

export type FormAction =
  | {
      type: 'SET_ORIGIN_ADDRESS';
      payload: string;
    }
  | {
      type: 'SET_ORIGIN_GEOCODE';
      payload: {
        lat: number;
        lng: number;
      };
    }
  | {
      type: 'SET_FREE_KEYWORD';
      payload: string;
    }
  | {
      type: 'SET_FREE_KEYWORDS';
      payload: string[];
    }
  | {
      type: 'SET_TARGET_KEYWORDS';
      payload: string[];
    }
  | {
      type: 'SET_RADIUS';
      payload: Radius;
    }
  | {
      type: 'SET_RECOMMEND_CHECKS';
      payload: {
        [key: string]: boolean;
      };
    }
  | {
      type: 'SET_ERROR_MESSAGES';
      payload: ErrorMessage;
    };

// State
export type SetOriginAddress = (address: string) => void;

export type GetOriginGeocode = () => originGeocode;

export type SetOriginGeocode = (geocode: Geocode) => void;

export type SetFreeKeyword = (keyword: string) => void;

export type KeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement>) => void;

export type SetFreeKeywords = (freeKeywords: string[]) => void;

export type SetTargetKeywords = (targetKeywords: string[]) => void;

export type SetRadius = (radius: string) => void;

export type SetErrorMessages = (errorMessages: {}) => void;

export type ChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;

export type RemoveFreeKeyword = (index: string) => void;

export type GetSearchResults = () => Promise;

export type FetchDistanceData = (place: FormattedNearbyPlace) => Promise<{ distance: number | undefined; duration: string | undefined; }>;

export type FetchNearbyPlaces =  (geocode: OriginGeocode, keyword: string) => Promise;

export type FormatDistanceWithUnit = (distance: number | undefined) => string | undefined;

export type SetResults = (results: ResultsProps) => void;

export type SetLoading = (loading: boolean) => void;

export type GetPlaceDistanceData = (places: FormattedNearbyPlace[] | undefined) => Promise<{ nearestPlace: NearestPlace | undefined; nearbyPlaces: NearestPlace[] | undefined; }> | undefined;

export type HasErrorMessages = (messages: ErrorMessage) => boolean;

export type SetRecommendChecks = (recommendChecks: {}) => void;

// Result

type FormattedNearbyPlace = {
  name: string | undefined;
  rating: number | undefined;
  ratings_total: number | undefined;
  lat: number | undefined;
  lng: number | undefined;
  address?: string | undefined;
  distance?: number | undefined;
  duration?: number | undefined;
};

type NearestPlace = {
  name: string;
  address: string;
  distance: number | undefined;
  duration: string | undefined;
  rating: number;
  reviewCount: number;
  geocode: {
    lat: number;
    lng: number;
  };
};

export type NearbyPlace = {
  name: string | undefined;
  address: string | undefined;
  distance: number | undefined;
  duration: string | undefined;
  lat: number | undefined;
  lng: number | undefined;
};

export type ResultItemProps = {
  result: ResultProps;
};
