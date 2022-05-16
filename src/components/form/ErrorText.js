import "../../styles/Error.css";

const ErrorText = ({ message, className }) => {
  return (
    <p
      id="radiusError"
      className={`error-text ${className}`}
      style={{ display: message ? "block" : "none" }}
    >
      {message}
    </p>
  );
};

export default ErrorText;
