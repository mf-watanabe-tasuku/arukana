import { createContext } from 'react';
import type { SearchContextProps } from '../../types';

const SearchContext = createContext({} as SearchContextProps);

export default SearchContext;
