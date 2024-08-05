import React from "react";
import styles from "./Button.module.css";

const Button = ({ type = "default", ...props }) => {
  return <button className={`${styles.button} ${styles[type]}`} {...props} />;
};

export default Button;
