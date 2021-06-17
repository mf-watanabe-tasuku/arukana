import "../styles/Error.css";

const errorText = ({ message }) => {
  return (
    <p id="radiusError" className="error">
      {message}
    </p>
  );
};

export default errorText;
