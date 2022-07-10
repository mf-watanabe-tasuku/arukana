import '../styles/Error.css';

const ErrorMessage = ({ message }) => {
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
