import '../styles/Error.css';

type ErrorMessageType = {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageType) => {
  return (
    <p
      className={`error-text`}
      style={{ display: message ? 'block' : 'none' }}
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
