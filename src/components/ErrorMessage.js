import '../styles/Error.css';

const ErrorMessage = ({ message, className }) => {
  return (
    <p
      className={`error-text ${className}`}
      style={{ display: message ? 'block' : 'none' }}
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
