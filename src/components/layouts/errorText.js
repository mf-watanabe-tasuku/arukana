import React from "react";
import "../../styles/Error.css";

const errorText = ({ message }) => {
  return (
    <p
      id="radiusError"
      className="error"
      style={{ display: message ? "block" : "none" }}
    >
      {message}
    </p>
  );
};

export default errorText;
