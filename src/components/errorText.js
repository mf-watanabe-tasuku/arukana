import React from "react";

const errorText = (props) => {
  return (
    <p id="radiusError" className="error">
      {props.message}
    </p>
  );
};

export default errorText;
