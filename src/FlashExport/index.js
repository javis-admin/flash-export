import React from "react";
import { saveAs } from "file-saver";
import { getFilteredData } from "./utils";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import WebWorker from "./WebWorker";
import workerObj from "../../public/worker";
// import { createWorkbook } from "./createExcelWorkbook"

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
  };

  const handleTerminate = () => {
    worker.terminate();
    const myWorker = new WebWorker(workerObj);
    myWorker.addEventListener("message", (event) => handleDownload(event.data));
    setWorker(myWorker);
    setProcessing(false);
    setProgress(0);
    // setTimeout(() => {
    // }, 1000);
  };

  const handleDownload = (data) => {
    saveAs(data, fileName + ".xlsx");
    setProcessing(false);
    setProgress(0);
  };

  if (!processing) {
    return <Button onClick={handleClick}>Export</Button>;
  }

  return (
    <div style={{ width: 240, display: "inline-flex", alignItems: "center" }}>
      <Button onClick={handleTerminate}>Cancel</Button>
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
