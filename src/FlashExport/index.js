import React from "react";

//Utils
import { getFilteredData } from "./utils";

// UI Components
import ProgressBar from "./ProgressBar";
import Button from "./Button";

// Worker Config
import WebWorker from "./WebWorker";
import workerObj from "../../public/worker";

const FlashExport = ({
  data,
  columns = [],
  fileName = "export-data",
  substituteValues = {},
}) => {
  const [processing, setProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [worker, setWorker] = React.useState(null);

  const multiDataset = getFilteredData(data, columns, substituteValues);

  React.useEffect(() => {
    const myWorker = new WebWorker(workerObj);
    myWorker.addEventListener("message", (event) => handleDownload(event.data));
    setWorker(myWorker);
  }, []);

  const handleClick = () => {
    setProcessing(true);
    worker.postMessage({ multiDataset });
    setProgress(40);
    const id = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 5;
        if (newProgress >= 80) {
          clearInterval(id);
        }
        return newProgress;
      });
    }, 500);
  };

  const handleTerminate = () => {
    worker.terminate();
    const myWorker = new WebWorker(workerObj);
    myWorker.addEventListener("message", (event) => handleDownload(event.data));
    setWorker(myWorker);
    setProgress(101);
    setTimeout(() => {
      setProgress(0);
      setProcessing(false);
    }, 1000);
  };

  const handleDownload = (data) => {
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName + ".xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setProcessing(false);
    setProgress(0);
  };

  if (!processing) {
    return <Button onClick={handleClick}>Export</Button>;
  }

  return (
    <div style={{ width: 240, display: "inline-flex", alignItems: "center" }}>
      {progress <= 100 && <Button onClick={handleTerminate}>Cancel</Button>}
      <ProgressBar
        progress={progress}
        size="small"
        status={
          progress === 100
            ? "success"
            : progress === 101
            ? "exception"
            : "active"
        }
      />
    </div>
  );
};

export default FlashExport;
