import React from "react";
import "./Button.css";

const Button = ({ type = "default", children, onClick, disabled = false }) => {
  if (disabled) {
    return (
      <button className={"button disabled"} disabled>
        {children}
      </button>
    );
  }
  return (
    <button
      className={`button ${type.length ? type : "default"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
