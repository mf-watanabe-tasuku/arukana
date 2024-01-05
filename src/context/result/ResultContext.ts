import { createContext } from 'react';
import type { ResultProps, ResultItemProps } from '../../types';

type ResultContextProps = {
  results: ResultItemProps[] | [],
  resultsWithPlace: ResultProps[],
  resultsWithoutPlace: [],
  setResults: (result: ResultItemProps[]) => void
}

const ResultContext = createContext({} as ResultContextProps);

export default ResultContext;
