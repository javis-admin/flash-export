import React from "react";

//Utils
import { getFilteredData } from "./utils";

// UI Components
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import ExportButton from "./ExportButton";
import { FlashExportProvider } from "./FlashExportProvider";

// Worker Config
import WebWorker from "./WebWorker";
import workerObj from "../../public/worker";
import Cancel from "./Icons/Cancel";

const FlashExport = ({
  data,
  columns = [],
  fileName = "export-data",
  substituteValues = [],
  type = "default",
  showPercentage = true,
  customProgressComponent,
  cancelBtnDisable = false,
  onError,
  children,
}) => {
  const [processing, setProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const worker = React.useRef(null);

  const multiDataset = getFilteredData(data, columns, substituteValues);

  React.useEffect(() => {
    const myWorker = new WebWorker(workerObj);
    myWorker.addEventListener("message", handleWorkerMessage);
    worker.current = myWorker;
  }, []);

  React.useEffect(() => {
    return () => {
      worker.current.terminate();
    };
  }, []);

  const handleWorkerMessage = (event) => {
    const message = event.data;

    if (message.type === 'progress') {
      const percentage = Math.floor((message.processed / message.total) * 80);
      setProgress(percentage);
    } else if (message.type === 'complete') {
      handleDownload(message.data);
    } else if (message.type === 'error') {
      // Handle error from worker
      setProgress(101); // Set progress to error state
      if (onError && typeof onError === 'function') {
        onError(message.message);
      } else {
        console.error('Export error:', message.message);
      }
      setProcessing(false);
    } else {
      handleDownload(message);
    }
  };

  const handleClick = () => {
    setProcessing(true);
    worker.current.postMessage({ multiDataset });
    setProgress(0);
  };

  const handleTerminate = () => {
    worker.current.terminate();
    const myWorker = new WebWorker(workerObj);
    myWorker.addEventListener("message", handleWorkerMessage);
    worker.current = myWorker;
    setProgress(0);
    setProcessing(false);
  };

  const handleDownload = (data) => {
    setProgress(100);
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
    return (
      <FlashExportProvider value={{ startExport: handleClick }}>
        {children || <ExportButton type={type} />}
      </FlashExportProvider>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
      className="flash-export_button"
    >
      {progress <= 100 && !cancelBtnDisable && (
        <Button type={type} onClick={handleTerminate}>
          <Cancel />
          {` `}Cancel
        </Button>
      )}
      {progress <= 100 && cancelBtnDisable && (
        <Button type={type} disabled>
          <Cancel />
          {` `}Cancel
        </Button>
      )}
      {customProgressComponent ? (
        customProgressComponent(progress, handleTerminate)
      ) : (
        <ProgressBar
          progress={progress}
          showPercentage={showPercentage}
          size="small"
          status={
            progress === 100
              ? "success"
              : progress === 101
                ? "exception"
                : "active"
          }
        />
      )}
    </div>
  );
};

export default FlashExport;
