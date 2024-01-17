import { styled } from 'styled-components';

const StyleErrorText = styled.p`
  font-size: 14px;
  color: red;
  margin: 0 0 10px;
`;

const ErrorMessage: React.FC<{message: string}> = ({ message }) => <StyleErrorText>{message}</StyleErrorText>;

export default ErrorMessage;
