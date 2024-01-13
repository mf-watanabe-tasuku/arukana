import { createContext } from 'react';
import type { FormContextProps } from '../../types';

const FormContext = createContext({} as FormContextProps);

export default FormContext;
