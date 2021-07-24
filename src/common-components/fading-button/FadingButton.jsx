import React from "react";
import PropTypes from "prop-types";
import "./FadingButton.css";

export const FadingButton = (props) => {
  return (
    <div onClick={props.onClick} className="fading-button-holder">
      {props.display}
    </div>
  );
};

FadingButton.propTypes = {
  display: PropTypes.node,
  onClick: PropTypes.func,
};
