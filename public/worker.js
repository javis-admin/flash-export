/*eslint-disable*/
export default () => {
  let isLoaded;
  try {
    importScripts(
      "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"
    );
    isLoaded = true;
  } catch (error) {
    isLoaded = false;
  }

  self.addEventListener("message", (e) => {
    if (!e) return;
    const wb = XLSX.utils.book_new();
    // Convert the data to a worksheet
    const ws = XLSX.utils.json_to_sheet(e.data.multiDataset, {
      cellStyles: true,
      sheetStubs: true,
      bookVBA: true,
      cellDates: true,
      WTF: true,
    });

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    postMessage(blob);
  });
};
