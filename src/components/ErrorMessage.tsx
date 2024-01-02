import { styled } from 'styled-components';

const StyleErrorText = styled.p`
  font-size: 14px;
  color: red;
  margin: 0 0 10px;
`;

type MessageType = {
  message: string
}

const ErrorMessage = ({ message }: MessageType) => <StyleErrorText>{message}</StyleErrorText>;

export default ErrorMessage;
