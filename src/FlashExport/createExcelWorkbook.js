// src/exportToXlsx.js
import * as XLSX from "xlsx";

export const createWorkbook = (data) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(data, {
    // header: columns,
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
  return blob;
};
