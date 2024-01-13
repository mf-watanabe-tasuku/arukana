import { styled } from 'styled-components';
import type { ErrorMessageType } from '../types';

const StyleErrorText = styled.p`
  font-size: 14px;
  color: red;
  margin: 0 0 10px;
`;

const ErrorMessage: React.FC<ErrorMessageType> = ({ message }) => <StyleErrorText>{message}</StyleErrorText>;

export default ErrorMessage;
