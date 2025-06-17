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

    // Process data in chunks to avoid memory issues
    const CHUNK_SIZE = 1000;
    const data = e.data.multiDataset;
    const totalRows = data.length;

    // Create workbook
    let wb = XLSX.utils.book_new();
    let ws;

    const headers = data.length > 0 ? Object.keys(data[0] || {}) : [];

    const processNextChunk = (startIndex) => {
      // Post progress update
      self.postMessage({
        type: 'progress',
        processed: Math.min(startIndex, totalRows),
        total: totalRows
      });

      if (startIndex >= totalRows) {
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const buffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
          compression: true
        });

        const blob = new Blob([buffer], { type: "application/octet-stream" });
        postMessage({ type: 'complete', data: blob });

        wb = null;
        ws = null;
        return;
      }

      const endIndex = Math.min(startIndex + CHUNK_SIZE, totalRows);
      const chunk = data.slice(startIndex, endIndex);

      try {
        if (startIndex === 0) {
          ws = XLSX.utils.json_to_sheet(chunk, {
            cellStyles: true,
            sheetStubs: true,
            bookVBA: true,
            cellDates: true,
          });

          if (headers.length > 0) {
            headers.forEach((header, index) => {
              const cellRef = XLSX.utils.encode_cell({ c: index, r: 0 });
              if (!ws[cellRef]) return;
              if (!ws[cellRef].s) ws[cellRef].s = {};
              ws[cellRef].s.font = { bold: true };
            });
          }
        } else {
          XLSX.utils.sheet_add_json(ws, chunk, {
            skipHeader: true,
            origin: -1
          });
        }

        // Schedule next chunk processing with a small delay to allow UI updates
        setTimeout(() => processNextChunk(endIndex), 0);
      } catch (error) {
        // Handle errors
        postMessage({
          type: 'error',
          message: error.message || 'Error processing data'
        });
      }
    };


    processNextChunk(0);
  });
};
