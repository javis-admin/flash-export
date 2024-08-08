import React from "react";
import "./Button.css";

const Button = ({ type = "default", children, onClick }) => {
  return (
    <div className={"button " + type} onClick={onClick}>
      {children}
    </div>
  );
};

export default Button;
