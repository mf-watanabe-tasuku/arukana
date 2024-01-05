import { styled } from 'styled-components';

const StyleErrorText = styled.p`
  font-size: 14px;
  color: red;
  margin: 0 0 10px;
`;

type ErrorMessageType = {
  message: string
};

const ErrorMessage: React.FC<ErrorMessageType> = ({ message }) => <StyleErrorText>{message}</StyleErrorText>;

export default ErrorMessage;
