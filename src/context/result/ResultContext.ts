import { createContext } from 'react';
import type { ResultContextProps } from '../../types';

const ResultContext = createContext({} as ResultContextProps);

export default ResultContext;
