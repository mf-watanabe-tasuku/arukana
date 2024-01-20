// Node

export type ChildrenNodeProps = {
  children: React.ReactNode;
};

// Context・Reducer

export type ResultsContextType = {
  results: ResultProps[];
  setResults: React.Dispatch<ResultProps[]>;
}

export type LoadingContextType = {
  loading: LoadingState;
  setLoading: React.Dispatch<LoadingState>;
}

export type FormContextType = {
  originAddress: string;
  originGeocode: Geocode;
  typingKeyword: string;
  freeKeywords: string[];
  targetKeywords: string[];
  radius: Radius;
  recommendChecks: {
    [key: string]: boolean;
  };
  errorMessages: ErrorMessage;
  setOriginAddress: SetOriginAddress;
  setOriginGeocode: SetOriginGeocode;
  setTypingKeyword: SetTypingKeyword;
  setFreeKeywords: SetFreeKeywords;
  setRadius: SetRadius;
  setErrorMessages: SetErrorMessages;
  setRecommendChecks: SetRecommendChecks;
  setTargetKeywords: SetTargetKeywords;
};

export type FormReducerType = (state: FormState, action: FormAction) => FormState;

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
      type: 'SET_TYPING_KEYWORD';
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

export type Geocode = {
  lat: number;
  lng: number;
}

type Radius = string | number;

type Distance = number | undefined;

type Duration = string | undefined;

export type DistanceData = {
  distance: Distance;
  duration: Duration;
}

export type ErrorMessage = {
  [key: string]: string;
};

type NearestPlace = {
  name: string;
  address: string;
  distance: Distance;
  duration: Duration;
  rating: number;
  reviewCount: number;
  geocode: {
    lat: number;
    lng: number;
  };
};

type NearbyPlace = {
  name: string | undefined;
  address: string | undefined;
  distance: Distance;
  duration: Duration;
  lat: number | undefined;
  lng: number | undefined;
};

type FormattedNearbyPlace = {
  name: string | undefined;
  rating: number | undefined;
  ratings_total: number | undefined;
  lat: number | undefined;
  lng: number | undefined;
  address?: string | undefined;
  distance?: Distance;
  duration?: Duration;
};

export type ResultItemProps = {
  result: ResultProps;
};

export type ResultProps = {
  keyword: string;
  nearestPlace: NearestPlace;
  nearbyPlaces: NearbyPlace[];
};

export type FormState = {
  originAddress: string;
  originGeocode: Geocode;
  typingKeyword: string;
  freeKeywords: string[];
  targetKeywords: string[];
  radius: Radius;
  recommendChecks: {
    [key: string]: boolean;
  };
  errorMessages: ErrorMessage;
};

// Function
type SetOriginAddress = (address: string) => void;

type GetOriginGeocode = () => Promise<Geocode>;

type SetOriginGeocode = (geocode: Geocode) => void;

type SetTypingKeyword = (keyword: string) => void;

type KeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement>) => void;

type SetFreeKeywords = (freeKeywords: string[]) => void;

type SetTargetKeywords = (targetKeywords: string[]) => void;

type SetRadius = (radius: string) => void;

type SetErrorMessages = (errorMessages: {}) => void;

type ChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;

type RemoveFreeKeyword = (index: string) => void;

type GetSearchResults = () => Promise;

type FetchDistanceData = (place: FormattedNearbyPlace) => Promise<{ distance: Distance; duration: Duration; }>;

type FetchNearbyPlaces =  (geocode: Geocode, keyword: string) => Promise;

type FormatDistanceWithUnit = (distance: number | undefined) => string | undefined;

type SetResults = (results: ResultsProps) => void;

type SetLoading = (loading: boolean) => void;

type GetPlaceDistanceData = (places: FormattedNearbyPlace[] | undefined) => Promise<{ nearestPlace: NearestPlace | undefined; nearbyPlaces: NearestPlace[] | undefined; }> | undefined;

type HasErrorMessages = (messages: ErrorMessage) => boolean;

type SetRecommendChecks = (recommendChecks: {}) => void;
