import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ progress, status = "normal", size = "small" }) => {
  const renderIndicator = () => {
    switch (status) {
      case "success":
        return (
          <span className={"icon successIcon"}>
            <svg viewBox="0 0 16 16">
              <path d="M6.6 11.2L3.2 7.8l-1.4 1.4L6.6 14 14 6.6l-1.4-1.4z" />
            </svg>
          </span>
        );
      case "exception":
        return (
          <span className={"icon exceptionIcon"}>
            <svg viewBox="0 0 16 16">
              <path d="M8 6.586L11.293 3.293l1.414 1.414L9.414 8l3.293 3.293-1.414 1.414L8 9.414l-3.293 3.293-1.414-1.414L6.586 8 3.293 4.707l1.414-1.414L8 6.586z" />
            </svg>
          </span>
        );
      default:
        return <span className={"percentText"}>{progress}%</span>;
    }
  };

  return (
    <div className={"progressContainer"}>
      <div className={`.progress ${size} ${status}`}>
        <div className={"progressBar"} style={{ width: `${progress}%` }} />
      </div>
      {renderIndicator()}
    </div>
  );
};

export default ProgressBar;
