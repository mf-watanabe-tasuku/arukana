import React from "react";
import "../styles/Error.css";

const errorText = (props) => {
  return (
    <p id="radiusError" className="error">
      {props.message}
    </p>
  );
};

export default errorText;
