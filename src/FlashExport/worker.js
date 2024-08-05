import { createWorkbook } from "./createExcelWorkbook";

// src/worker.js
onmessage = function (e) {
  const blob = createWorkbook(e.data.multiDataset);
  postMessage(blob);
};
