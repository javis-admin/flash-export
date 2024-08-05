import React from "react";
import { saveAs } from "file-saver";
import { filterKeys, validateAndReturnData } from "./utils";
import ProgressBar from "./ProgressBar";
import Button from "./Button";

const FlashExport = ({
  data,
  columns = [],
  fileName = "export-data",
  substituteValues = {},
}) => {
  const [processing, setProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [worker, setWorker] = React.useState(
    new Worker(new URL("./worker.js", import.meta.url))
  );
  const [multiDataset, setMultiDataset] = React.useState([]);

  React.useEffect(() => {
    const filteredData = columns.length ? filterKeys(data, columns) : data;
    const temp = [];
    filteredData.forEach((element) => {
      Object.keys(element).forEach((key) => {
        const val = element[key];
        element[key] = validateAndReturnData(key, val, substituteValues);
      });
      temp.push(element);
    });

    setMultiDataset(temp);
  }, [data, columns, substituteValues]);

  const handleClick = () => {
    setProcessing(true);
    worker.postMessage({ multiDataset, columns });
    setProgress(40);
  };

  const handleTerminate = () => {
    worker.terminate();
    setWorker(new Worker(new URL("./worker.js", import.meta.url)));
    setProgress(101);
    setTimeout(() => {
      setProcessing(false);
      setProgress(0);
    }, 1000);
  };

  React.useEffect(() => {
    // Handle messages received from the worker
    worker.onmessage = (e) => {
      setProgress(90);
      saveAs(e.data, fileName + ".xlsx");
      setProgress(100);
      setTimeout(() => {
        setProcessing(false);
        setProgress(0);
      }, 1000);
    };
  }, [worker, fileName]);

  if (!processing) {
    return <Button onClick={handleClick}>Export</Button>;
  }
  return (
    <div style={{ width: 240, display: "inline-flex", alignItems: "center" }}>
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
      <Button onClick={handleTerminate}>Cancel Export</Button>
    </div>
  );
};

export default FlashExport;
