import React from "react";
import styles from "./Button.module.css";

const Button = ({ type = "default", children, onClick }) => {
  return (
    <div className={`${styles.button} ${styles[type]}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Button;
