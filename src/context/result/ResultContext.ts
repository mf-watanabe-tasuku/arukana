import { createContext } from 'react';
import type { ResultProps, ResultItemProps } from '../../components/Result/ResultItem';

type ResultContextProps = {
  results: ResultItemProps[] | [],
  resultsWithPlace: ResultProps[],
  resultsWithoutPlace: [],
  setResults: (result: ResultItemProps[]) => void
}

const ResultContext = createContext({} as ResultContextProps);

export default ResultContext;
